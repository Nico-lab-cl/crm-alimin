
import { getUserReservations, getAllClients } from "@/actions/dashboard";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { PaymentButtons } from "@/components/user/PaymentButtons";
import { SignContractModal } from "@/components/SignContractModal";
import Link from "next/link";
import { ArrowLeft, FileDown, ExternalLink, User } from "lucide-react";
import { UserNavigator } from "@/components/admin/UserNavigator";
import { InterestSimulator } from "@/components/admin/InterestSimulator";

export default async function AdminUserPlotsPage({ params }: { params: { userId: string } }) {
    const reservations = await getUserReservations(params.userId);
    const allClients = await getAllClients();

    // Get current user name from the first reservation (if any) or find in list
    let userName = "Usuario Desconocido";
    if (params.userId === 'all') {
        userName = "Todos los Usuarios";
    } else {
        const currentUser = allClients.find(u => u.id === params.userId);
        userName = currentUser?.name || reservations[0]?.buyer?.name || "Usuario Desconocido";
    }

    return (
        <div className="min-h-screen relative flex flex-col items-center pt-24 pb-12 px-4 bg-black/95">
            <div className="absolute inset-0 bg-[url('/terreno-bg.JPG')] bg-cover bg-center opacity-20 blur-sm fixed" />

            {/* Admin Navigation Header */}
            <div className="fixed top-4 left-4 z-50 flex gap-4">
                <Link href="/admin/dashboard" className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-lg text-white hover:bg-white/20 transition-colors">
                    <ArrowLeft className="w-4 h-4" />
                    Volver al Panel
                </Link>
            </div>

            <div className="container mx-auto relative z-10">
                <header className="mb-12">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
                        <div>
                            <div className="inline-block px-3 py-1 mb-2 rounded-full bg-yellow-500/20 text-yellow-500 border border-yellow-500/50 text-sm font-bold">
                                MODO VISTA ADMIN
                            </div>
                            <h1 className="text-4xl font-extrabold text-[#36595F] drop-shadow-[0_2px_4px_rgba(255,255,255,0.1)] tracking-tight">
                                Gestión de: {userName}
                            </h1>
                            <div className="mt-4">
                                <InterestSimulator />
                            </div>
                        </div>

                        {/* User Navigator / Search */}
                        <div className="w-full md:w-auto">
                            <UserNavigator users={allClients} />
                        </div>
                    </div>
                </header>

                <section>
                    {reservations.length === 0 ? (
                        <Card className="bg-black/40 border-white/10 text-white backdrop-blur-sm">
                            <CardContent className="p-8 text-center text-gray-300">
                                <p>Este usuario no tiene terrenos PAGADOS o CONFIRMADOS.</p>
                                <p className="text-sm text-gray-500 mt-2">Solo se muestran ventas cerradas.</p>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {reservations.map((res) => (
                                <Card key={res.id} className="border-white/10 shadow-lg hover:shadow-xl transition-shadow bg-black/60 text-white backdrop-blur-md flex flex-col">
                                    <CardHeader className="bg-[#36595F]/90 text-white rounded-t-lg border-b border-white/10">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <CardTitle>Lote {res.lot.number}</CardTitle>
                                                <CardDescription className="text-white/80">Etapa {res.lot.stage}</CardDescription>
                                            </div>
                                            {/* Owner Badge on Card */}
                                            <div className="bg-black/20 px-2 py-1 rounded text-xs flex items-center gap-1" title="Propietario">
                                                <User className="w-3 h-3" />
                                                <span className="max-w-[100px] truncate">{res.buyer?.name || 'Sin nombre'}</span>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="p-6 space-y-4 flex-1 flex flex-col">
                                        <div className="flex justify-between items-center border-b border-white/10 pb-2">
                                            <span className="font-medium text-[#36595F]">Estado:</span>
                                            <span className={`px-2 py-1 rounded text-xs font-bold ${res.status === 'paid' ? 'bg-green-900/50 text-green-400 border border-green-500/30' :
                                                res.status === 'pending_payment' ? 'bg-yellow-900/50 text-yellow-400 border border-yellow-500/30' :
                                                    'bg-gray-800 text-gray-400 border border-gray-600/30'
                                                }`}>
                                                {res.status === 'paid' ? 'PAGADO' : res.status.toUpperCase()}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center text-sm text-gray-300">
                                            <span>Superficie:</span>
                                            <span>{res.lot.area_m2} m²</span>
                                        </div>
                                        <div className="flex justify-between items-center text-sm text-gray-300">
                                            <span>Valor Total:</span>
                                            <span>${res.lot.price_total_clp?.toLocaleString('es-CL') || 'N/A'}</span>
                                        </div>

                                        <div className="space-y-3 pt-2 mt-auto">
                                            {/* Contract Actions */}
                                            {res.signed_at ? (
                                                <a
                                                    href={`/api/contracts/${res.id}/pdf`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="w-full py-2 px-4 bg-green-900/30 text-green-400 border border-green-500/30 rounded text-center text-sm font-bold flex items-center justify-center gap-2 hover:bg-green-900/50 transition-colors cursor-pointer"
                                                >
                                                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                                                    Firmado Digitalmente (Ver)
                                                </a>
                                            ) : (
                                                <a
                                                    href={`/api/contracts/${res.id}/pdf`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="w-full py-2 px-4 bg-gray-800/50 text-gray-400 border border-gray-700/50 rounded text-center text-sm flex items-center justify-center gap-2 hover:bg-gray-800 hover:text-gray-300 transition-colors cursor-pointer"
                                                    title="Descargar contrato pendiente"
                                                >
                                                    <FileDown className="w-4 h-4" />
                                                    Contrato Pendiente (Descargar)
                                                </a>
                                            )}

                                            <PaymentButtons
                                                reservationId={res.id}
                                                lot={res.lot}
                                                reservation={{
                                                    pie_status: res.pie_status,
                                                    installments_paid: res.installments_paid
                                                }}
                                                acquisitionDate={res.created_at.toISOString()}
                                                isAdminView={true}
                                            />

                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
}
