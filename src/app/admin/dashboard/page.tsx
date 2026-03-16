import { auth } from "@/auth"
import { getAdminPipeline, getSellers, getAdminLots, getAdminUsersList, getAdminStats, getSoldLotsForPostventa } from "@/actions/dashboard"
import { getFullPostventaData } from "@/actions/postventa"
import { getPaginatedReceipts } from "@/actions/receipts"
import { AdminDashboardClient } from "./AdminDashboardClient"

const POSTVENTA_EMAIL = 'postventa@lomasdelmar.cl';

export default async function AdminDashboard({ 
    searchParams 
}: { 
    searchParams: { 
        stage?: string,
        mobileTab?: string
    } 
}) {
    const session = await auth()
    const userRole = session?.user?.role
    const userEmail = session?.user?.email || ''
    
    if (!session || (userRole !== 'ADMIN' && userRole !== 'SELLER')) {
        return <div className="p-8 text-center text-red-500 font-semibold">No autorizado</div>
    }

    const isPostventa = userEmail === POSTVENTA_EMAIL
    const isAdmin = userRole === 'ADMIN'
    const postventaStage = searchParams.stage || 'ALL'

    // Conditional Fetching Optimization:
    // Regular Admins need everything.
    // Postventa users ONLY need Ledger and Receipts.
    const activeTab = searchParams.mobileTab || (isPostventa ? 'recibos' : 'terrenos')
    const needsPostventaData = (isPostventa || isAdmin) && (activeTab === 'ledger' || activeTab === 'alertas' || activeTab === 'postventa' || !searchParams.mobileTab)

    const [
        pipelineResult, 
        sellersResult, 
        lotsResult, 
        usersResult, 
        statsResult, 
        postventaResult, 
        receiptsResult
    ] = await Promise.all([
        (!isPostventa && userRole === 'ADMIN') ? getAdminPipeline() : Promise.resolve({ success: true, data: [], error: null }),
        (!isPostventa && userRole === 'ADMIN') ? getSellers() : Promise.resolve({ success: true, data: [], error: null }),
        getAdminLots(),
        (!isPostventa && userRole === 'ADMIN') ? getAdminUsersList() : Promise.resolve({ success: true, users: [], error: null }),
        (!isPostventa && userRole === 'ADMIN') ? getAdminStats() : Promise.resolve({ success: true, data: null, error: null }),
        needsPostventaData ? getFullPostventaData({ stage: postventaStage }) : Promise.resolve({ success: true, data: [], stats: { total: 0, late: 0, grace: 0, upcoming: 0, ok: 0 } }),
        (isPostventa || (isAdmin && activeTab === 'postventa')) ? getPaginatedReceipts({ page: 1, pageSize: 50 }) : Promise.resolve({ success: false, receipts: [], error: null })
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
    let postventaLedger: any[] = []
    let postventaStats = { total: 0, late: 0, grace: 0, upcoming: 0, ok: 0 }

    if ((isPostventa || isAdmin) && (postventaResult as any)?.success) {
        postventaLedger = (postventaResult as any).data || []
        postventaStats = (postventaResult as any).stats || postventaStats
    }

    return (
        <AdminDashboardClient
            pipelineData={(pipelineResult as any).data || []}
            sellers={(sellersResult as any).data || []}
            lots={(lotsResult as any).data || []}
            users={(usersResult as any).users || []}
            userEmail={userEmail}
            receipts={(receiptsResult as any).receipts || []}
            paymentStats={paymentStats as any}
            ledger={postventaLedger}
            debtAlerts={postventaLedger}
            postventaStats={postventaStats}
            initialMobileTab={searchParams.mobileTab}
            postventaStage={postventaStage}
        />
    )
}
