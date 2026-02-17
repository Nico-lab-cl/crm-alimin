import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';
import { headers } from 'next/headers';

export type ActionType = 'CREATE' | 'UPDATE' | 'DELETE' | 'LOGIN' | 'LOGOUT' | 'OTHER';

interface LogParams {
    action: ActionType;
    entity: string;
    entityId?: string;
    details?: string;
    pk?: string;
}

export async function logAdminAction(params: LogParams) {
    try {
        const session = await auth();
        const headersList = await headers();
        const ip = headersList.get('x-forwarded-for') || 'unknown';
        const userAgent = headersList.get('user-agent') || 'unknown';

        // Only log if user is present (usually admin)
        // But we might want to log system actions too, so we make user optional in DB
        const userId = session?.user?.id;
        const userEmail = session?.user?.email;

        await prisma.auditLog.create({
            data: {
                action: params.action,
                entity: params.entity,
                entity_id: params.entityId,
                details: params.details,
                pk: params.pk,
                user_id: userId,
                user_email: userEmail,
                ip_address: ip,
                user_agent: userAgent,
            },
        });
    } catch (error) {
        console.error('Failed to create audit log:', error);
        // Silent fail to not disrupt main flow
    }
}
