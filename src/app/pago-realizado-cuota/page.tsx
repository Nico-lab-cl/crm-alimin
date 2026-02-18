'use client';

import { Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { CheckCircle2, ArrowRight, Loader2, CalendarClock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Footer } from '@/components/Footer';

function PaymentInstallmentSuccessContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const amount = searchParams.get('amount');
    const token = searchParams.get('token');

    const [countdown, setCountdown] = useState(10);

    const formatCurrency = (val: string | null) => {
        if (!val) return '$0';
        return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(Number(val));
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
        <div className="min-h-screen bg-black/95 relative flex flex-col">
            <div className="absolute inset-0 bg-[url('/terreno-bg.JPG')] bg-cover bg-center opacity-30 blur-sm fixed" />

            <main className="container mx-auto px-4 py-12 flex-grow relative z-10 flex items-center justify-center">
                <div className="w-full max-w-lg">
                    <div className="bg-white rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-700 ring-1 ring-white/20">

                        {/* Header: Brand Blue/Green */}
                        <div className="bg-[#36595F] px-8 py-10 text-center relative overflow-hidden">
                            <div className="absolute inset-0 bg-[url('/pattern-opacity.png')] opacity-10" />
                            <div className="relative z-10">
                                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/20 backdrop-blur-md mb-6 animate-scale-in shadow-lg">
                                    <CalendarClock className="w-10 h-10 text-white" strokeWidth={2.5} />
                                </div>
                                <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">¡Cuota Pagada!</h1>
                                <p className="text-white/80">Tu mensualidad ha sido registrada correctamente.</p>
                            </div>
                        </div>

                        {/* Body */}
                        <div className="p-8 space-y-8">
                            <div className="space-y-4">
                                <div className="bg-[#36595F]/5 rounded-xl p-5 border border-[#36595F]/10 shadow-sm">
                                    <p className="text-sm text-[#36595F] mb-1 uppercase tracking-wider font-semibold">Monto Pagado</p>
                                    <p className="text-3xl font-bold text-[#36595F]">{formatCurrency(amount)}</p>
                                </div>
                            </div>

                            <div className="text-center">
                                <p className="text-xs text-gray-400 mb-1">Código de transacción</p>
                                <code className="bg-gray-100 px-3 py-1 rounded text-xs font-mono text-gray-600 block w-full truncate">
                                    {token}
                                </code>
                            </div>

                            <div className="pt-2">
                                <Link href="/user/plots" className="block">
                                    <Button className="w-full h-14 text-lg bg-[#36595F] hover:bg-[#2b464a] text-white shadow-xl hover:shadow-2xl transition-all duration-300 rounded-xl group relative overflow-hidden">
                                        <span className="relative z-10 flex items-center justify-center gap-2">
                                            Volver a Mis Terrenos ({countdown}s)
                                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                        </span>
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <div className="relative z-10"><Footer /></div>
        </div>
    );
}

export default function PaymentInstallmentSuccessPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-black/95 flex items-center justify-center"><Loader2 className="animate-spin h-10 w-10 text-[#36595F]" /></div>}>
            <PaymentInstallmentSuccessContent />
        </Suspense>
    );
}
