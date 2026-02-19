import { getUserReservations, getAllClients } from "@/actions/dashboard";
import { AdminPlotManager } from "@/components/admin/AdminPlotManager";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function AdminUserPlotsPage({ params }: { params: { userId: string } }) {
    const reservations = await getUserReservations(params.userId);
    const allClients = await getAllClients();

    // Get current user name
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

            <AdminPlotManager
                reservations={reservations}
                allClients={allClients}
                userId={params.userId}
                initialUserName={userName}
            />
        </div>
    );
}
