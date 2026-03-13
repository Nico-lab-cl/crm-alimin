import { auth } from "@/auth"
import { getAdminPipeline, getSellers, getAdminLots, getAdminUsersList, getAdminStats } from "@/actions/dashboard"
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
    const userEmail = session?.user?.email || ''
    const isPostventa = userEmail === POSTVENTA_EMAIL

    const postventaStage = searchParams.stage || 'ALL'

    // Conditional Fetching Optimization:
    // Regular Admins need Pipeline, Sellers, Lots, Users, and Stats.
    // Postventa users ONLY need Ledger and Receipts (and minimal stats for context).
    const [
        pipelineResult, 
        sellersResult, 
        lotsResult, 
        usersResult, 
        statsResult, 
        postventaResult, 
        receiptsResult
    ] = await Promise.all([
        !isPostventa ? getAdminPipeline() : Promise.resolve({ success: true, data: [], error: null }),
        !isPostventa ? getSellers() : Promise.resolve({ success: true, data: [], error: null }),
        getAdminLots(),
        !isPostventa ? getAdminUsersList() : Promise.resolve({ success: true, users: [], error: null }),
        !isPostventa ? getAdminStats() : Promise.resolve({ success: true, data: null, error: null }),
        isPostventa ? getFullPostventaData({ stage: postventaStage }) : Promise.resolve({ success: false, data: [], error: null }),
        isPostventa ? getPaginatedReceipts({ page: 1, pageSize: 50 }) : Promise.resolve({ success: false, receipts: [], error: null })
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

    if (isPostventa && (postventaResult as any)?.success) {
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
            debtAlerts={[]} 
            postventaStats={postventaStats}
            initialMobileTab={searchParams.mobileTab}
            postventaStage={postventaStage}
        />
    )
}
