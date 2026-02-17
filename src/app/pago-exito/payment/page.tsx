'use client';

import { Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import Link from 'next/link';

function PaymentSuccessContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const amount = searchParams.get('amount');
    const token = searchParams.get('token');
    const scope = searchParams.get('scope'); // PIE or INSTALLMENT

    const [countdown, setCountdown] = useState(10);

    const formatCurrency = (val: string | null) => {
        if (!val) return '$0';
        return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(Number(val));
    };

    const getScopeLabel = (s: string | null) => {
        if (s === 'PIE') return 'Pago de Pie Inicial';
        if (s === 'INSTALLMENT') return 'Pago de Cuota(s)';
        return 'Pago';
    };

    useEffect(() => {
        const timer = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    router.push('/user/plots');
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [router]);

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
            <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center space-y-6 animate-in fade-in zoom-in duration-500">
                <div className="mx-auto bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mb-4">
                    <CheckCircle2 className="w-10 h-10 text-green-600" />
                </div>

                <h1 className="text-3xl font-bold text-gray-900">¡Pago Exitoso!</h1>

                <div className="space-y-2 text-gray-600">
                    <p className="text-lg">Has realizado correctamente el <span className="font-semibold text-gray-900">{getScopeLabel(scope)}</span>.</p>
                    <div className="bg-gray-100 p-4 rounded-lg mt-4">
                        <p className="text-sm text-gray-500 mb-1">Monto Pagado</p>
                        <p className="text-2xl font-bold text-[#36595F]">{formatCurrency(amount)}</p>
                    </div>
                </div>

                <div className="text-sm text-gray-500">
                    Código de transacción: <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">{token?.slice(0, 10)}...</span>
                </div>

                <div className="pt-4 space-y-3">
                    <Link href="/user/plots">
                        <Button className="w-full bg-[#36595F] hover:bg-[#2A464B] text-white">
                            Volver a Mis Terrenos ({countdown}s)
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default function PaymentSuccessPage() {
    return (
        <Suspense fallback={<div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin h-8 w-8 text-[#36595F]" /></div>}>
            <PaymentSuccessContent />
        </Suspense>
    );
}
