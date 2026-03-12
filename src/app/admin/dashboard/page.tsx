import { auth } from "@/auth"
import { getAdminPipeline, getSellers, getAdminLots, getPaginatedAdminUsers, getAdminStats } from "@/actions/dashboard"
import { getPostventaData } from "@/actions/postventa"
import { AdminDashboardClient } from "./AdminDashboardClient"

const POSTVENTA_EMAIL = 'postventa@lomasdelmar.cl';

export default async function AdminDashboard({ 
    searchParams 
}: { 
    searchParams: { userPage?: string, search?: string } 
}) {
    const session = await auth()
    const userEmail = session?.user?.email || ''
    const isPostventa = userEmail === POSTVENTA_EMAIL

    const userPage = parseInt(searchParams.userPage || '1')
    const search = searchParams.search || ''

    const [pipelineResult, sellersResult, lotsResult, usersResult, statsResult, postventaData] = await Promise.all([
        getAdminPipeline(),
        getSellers(),
        getAdminLots(),
        getPaginatedAdminUsers(userPage, 20, search),
        getAdminStats(),
        isPostventa ? getPostventaData() : Promise.resolve({ success: false, ledger: [], debtAlerts: [] })
    ])

    if (pipelineResult.error || statsResult.error) {
        return <div className="p-8 text-center text-red-500 font-semibold">{pipelineResult.error || statsResult.error}</div>
    }

    const paymentStats = statsResult.data || {
        totalLots: 0,
        soldLots: 0,
        lotsWithPiePaid: 0,
        lotsWithPiePending: 0,
        totalInstallmentsPaid: 0,
    }

    // Fetch receipts and ledger for postventa user
    let receipts: any[] = []
    let ledger: any[] = []
    let debtAlerts: any[] = []

    if (isPostventa && postventaData?.success) {
        ledger = (postventaData as any).ledger || []
        debtAlerts = (postventaData as any).debtAlerts || []
        receipts = ledger.flatMap(entry => entry.receipts || [])
    }

    return (
        <AdminDashboardClient
            pipelineData={(pipelineResult as any).data || []}
            sellers={(sellersResult as any).data || []}
            lots={(lotsResult as any).data || []}
            users={(usersResult as any).users || []}
            userTotalPages={(usersResult as any).totalPages || 1}
            userCurrentPage={userPage}
            userSearch={search}
            userEmail={userEmail}
            receipts={receipts}
            paymentStats={paymentStats as any}
            ledger={ledger}
            debtAlerts={debtAlerts}
        />
    )
}
