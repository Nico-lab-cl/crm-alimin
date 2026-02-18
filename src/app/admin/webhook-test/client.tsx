"use client";

import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useState } from "react";
import { Loader2 } from "lucide-react";

interface WebhookTesterClientProps {
    reservationId: string;
    reservationAmount: number;
}

export function WebhookTesterClient({ reservationId, reservationAmount }: WebhookTesterClientProps) {
    const [loadingPie, setLoadingPie] = useState(false);
    const [loadingCuota, setLoadingCuota] = useState(false);

    const testWebhook = async (type: 'PIE' | 'INSTALLMENT', setLoader: (v: boolean) => void) => {
        setLoader(true);
        try {
            const amount = type === 'PIE' ? 5000000 : 250000; // Mock amounts
            const res = await fetch(`/api/test-webhook?id=${reservationId}&type=${type}&amount=${amount}`);
            const data = await res.json();

            if (res.ok && data.success) {
                toast.success(`Webhook ${type} enviado exitosamente.`);
            } else {
                toast.error(`Error enviando webhook: ${data.error || 'Desconocido'}`);
            }
        } catch (error) {
            toast.error("Error de conexión al simular webhook");
        } finally {
            setLoader(false);
        }
    };

    return (
        <div className="flex gap-4 mt-2">
            <Button
                onClick={() => testWebhook('PIE', setLoadingPie)}
                disabled={loadingPie}
                className="bg-emerald-600 hover:bg-emerald-700"
            >
                {loadingPie && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Simular Pago Pie
            </Button>

            <Button
                onClick={() => testWebhook('INSTALLMENT', setLoadingCuota)}
                disabled={loadingCuota}
                className="bg-blue-600 hover:bg-blue-700"
            >
                {loadingCuota && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Simular Pago Cuota
            </Button>
        </div>
    );
}
