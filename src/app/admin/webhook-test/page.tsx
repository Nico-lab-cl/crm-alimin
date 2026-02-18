
import { prisma } from '@/lib/prisma';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { WebhookTesterClient } from './client';

export const dynamic = 'force-dynamic';

export default async function WebhookTestPage() {
    const reservations = await prisma.reservation.findMany({
        take: 20,
        orderBy: { created_at: 'desc' },
        include: { lot: true, buyer: true }
    });

    return (
        <div className="p-6 space-y-6">
            <h1 className="text-3xl font-bold text-white">Probador de Webhooks</h1>
            <p className="text-gray-300">
                Usa esta herramienta para simular el envío de webhooks de pago (Pie y Cuotas) para reservas existentes.
                Esto es útil para verificar que N8N está recibiendo los datos correctamente.
            </p>

            <div className="grid gap-6">
                {reservations.map(res => (
                    <Card key={res.id} className="bg-slate-800 border-slate-700 text-white">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-lg flex justify-between">
                                <span>{res.name || 'Sin Nombre'}</span>
                                <span className="text-sm font-normal text-gray-400">{res.created_at.toLocaleString()}</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 text-sm text-gray-300">
                                <div>
                                    <p><strong>ID:</strong> {res.id}</p>
                                    <p><strong>Email:</strong> {res.email}</p>
                                    <p><strong>Lote:</strong> {res.lot?.number} (ID: {res.lot_id})</p>
                                </div>
                                <div>
                                    <p><strong>Estado:</strong> {res.pipeline_stage}</p>
                                    <p><strong>Pagado:</strong> {res.status}</p>
                                </div>
                            </div>

                            <WebhookTesterClient
                                reservationId={res.id}
                                reservationAmount={res.lot?.reservation_amount_clp || 10000}
                            />
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
