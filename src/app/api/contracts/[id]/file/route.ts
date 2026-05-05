import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth();
        const { id } = await params;
        const searchParams = request.nextUrl.searchParams;
        const type = searchParams.get('type');
        const name = searchParams.get('name');

        const reservation = await prisma.reservation.findUnique({
            where: { id }
        });

        if (!reservation) {
            return NextResponse.json({ error: 'Reservation not found' }, { status: 404 });
        }

        // Authorization check: Admin, Postventa, or Buyer
        let isAuthorized = false;
        if (session && session.user) {
            const isAdmin = session.user.role === 'ADMIN' || session.user.role === 'SELLER';
            const isPostventa = session.user.email === 'postventa@lomasdelmar.cl';
            const isBuyer = reservation.buyer_id === session.user.id;
            const isEmailMatch = reservation.email === session.user.email;
            
            if (isAdmin || isPostventa || isBuyer || isEmailMatch) {
                isAuthorized = true;
            }
        }

        if (!isAuthorized) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        let base64Data: string | null = null;
        let fileName = name || 'documento';

        // 1. Check Contrato de Reserva (Upload Field)
        if (type === 'RESERVA' || type === 'uploaded_contract_url') {
            base64Data = reservation.uploaded_contract_url;
            fileName = 'Contrato_Reserva.pdf';
        } 
        // 2. Check Promesa de Compraventa
        else if (type === 'PROMESA') {
            let legacyDocs: any[] = [];
            if (reservation.legacy_uploaded_contracts) {
                try {
                    const raw = reservation.legacy_uploaded_contracts;
                    legacyDocs = typeof raw === 'string' ? JSON.parse(raw) : raw;
                } catch (e) {
                    console.error("[File Proxy] Error parsing legacy_uploaded_contracts:", e);
                }
            }
            
            // Ensure legacyDocs is an array before accessing [0]
            const docsArray = Array.isArray(legacyDocs) ? legacyDocs : (legacyDocs ? [legacyDocs] : []);
            if (docsArray.length > 0 && docsArray[0].url) {
                base64Data = docsArray[0].url;
                fileName = docsArray[0].name || 'Promesa_Compraventa.pdf';
            }
        } 
        // 3. Check Manual Documents
        else {
            let manualDocs: any[] = [];
            if (reservation.manual_documents) {
                try {
                    const raw = reservation.manual_documents;
                    manualDocs = Array.isArray(raw) ? (raw as any[]) : (typeof raw === 'string' ? JSON.parse(raw) : [raw]);
                } catch (e) {
                    console.error("[File Proxy] Error parsing manual_documents:", e);
                }
            }
            
            // Safe find in array
            const docsArray = Array.isArray(manualDocs) ? manualDocs : [];
            const docMatch = docsArray.find(d => d && d.category === type && (!name || d.name === name));
            if (docMatch) {
                base64Data = docMatch.url;
                fileName = docMatch.name || 'Documento';
            }
        }

        if (!base64Data) {
            return NextResponse.json({ error: 'File not found in database' }, { status: 404 });
        }

        // --- NEW: Handle direct URLs (S3, External, etc.) ---
        if (base64Data.startsWith('http')) {
            console.log(`[File Proxy] Redirecting to external URL: ${base64Data}`);
            return NextResponse.redirect(base64Data);
        }

        // Support standard Data URLs: data:[<mediatype>][;base64],<data>
        if (!base64Data.startsWith('data:')) {
            // Check if it looks like base64. If it has spaces or special chars not in b64, it might be a malformed path/string
            const isBase64 = /^[A-Za-z0-9+/]*={0,2}$/.test(base64Data.trim());
            
            if (isBase64) {
                // Assume it's an old direct base64 encoded PDF string if no prefix is found.
                base64Data = `data:application/pdf;base64,${base64Data.trim()}`;
            } else {
                // It's not a Data URL, not an HTTP URL, and not valid Base64. 
                // It might be a local path or a filename stored incorrectly.
                console.error(`[File Proxy] Unrecognized file format in DB for reservation ${id}: ${base64Data.substring(0, 50)}...`);
                return NextResponse.json({ error: 'Unrecognized file format stored in database' }, { status: 500 });
            }
        }

        const matches = base64Data.trim().match(/^data:([a-zA-Z0-9.\-\+/]+);base64,(.+)$/);
        
        if (!matches || matches.length !== 3) {
            // Fallback for non-base64 Data URIs or malformed matches
            if (base64Data.startsWith('data:')) {
                const parts = base64Data.split(',');
                if (parts.length > 1) {
                    const meta = parts[0];
                    const isBase64 = meta.includes('base64');
                    const mime = meta.split(':')[1]?.split(';')[0] || 'application/octet-stream';
                    
                    let content: Buffer | string;
                    if (isBase64) {
                        content = Buffer.from(parts[1], 'base64');
                    } else {
                        try {
                            content = decodeURIComponent(parts[1]);
                        } catch (e) {
                            content = parts[1];
                        }
                    }

                    return new NextResponse(content, {
                        headers: { 
                            'Content-Type': mime, 
                            'Content-Disposition': `inline; filename="${fileName}"`,
                            'Cache-Control': 'public, max-age=31536000, immutable'
                        }
                    });
                }
            }
            console.error(`[File Proxy] Invalid file format in DB for reservation ${id}`);
            return NextResponse.json({ error: 'Invalid file format stored in database' }, { status: 500 });
        }

        const mimeType = matches[1];
        const fileContent = matches[2];
        const buffer = Buffer.from(fileContent, 'base64');

        return new NextResponse(buffer, {
            headers: {
                'Content-Type': mimeType,
                'Content-Disposition': `inline; filename="${fileName}"`,
                'Cache-Control': 'public, max-age=31536000, immutable'
            },
        });

    } catch (error) {
        console.error('Error serving document file:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
