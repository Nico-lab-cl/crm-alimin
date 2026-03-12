import { auth } from "@/auth"
import { getAdminPipeline, getSellers, getAdminLots, getPaginatedAdminUsers, getAdminStats } from "@/actions/dashboard"
import { getPaginatedPostventaData } from "@/actions/postventa"
import { AdminDashboardClient } from "./AdminDashboardClient"

const POSTVENTA_EMAIL = 'postventa@lomasdelmar.cl';

export default async function AdminDashboard({ 
    searchParams 
}: { 
    searchParams: { 
        userPage?: string, search?: string, 
        postventaPage?: string, postventaSearch?: string, postventaStage?: string, postventaStatus?: string,
        mobileTab?: string
    } 
}) {
    const session = await auth()
    const userEmail = session?.user?.email || ''
    const isPostventa = userEmail === POSTVENTA_EMAIL

    const userPage = parseInt(searchParams.userPage || '1')
    const search = searchParams.search || ''

    const postventaPage = parseInt(searchParams.postventaPage || '1')
    const postventaSearch = searchParams.postventaSearch || ''
    const postventaStage = searchParams.postventaStage || 'ALL'
    const postventaStatus = (searchParams.postventaStatus as any) || 'ALL'

    const [pipelineResult, sellersResult, lotsResult, usersResult, statsResult, postventaResult] = await Promise.all([
        getAdminPipeline(),
        getSellers(),
        getAdminLots(),
        getPaginatedAdminUsers(userPage, 20, search),
        getAdminStats(),
        isPostventa ? getPaginatedPostventaData({
            page: postventaPage,
            pageSize: 20,
            search: postventaSearch,
            stage: postventaStage,
            status: postventaStatus
        }) : Promise.resolve({ success: false, data: [], totalPages: 0 })
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
    let postventaTotalPages = 1
    let postventaStats = { total: 0, late: 0, grace: 0, upcoming: 0, ok: 0 }

    if (isPostventa && (postventaResult as any)?.success) {
        postventaLedger = (postventaResult as any).data || []
        postventaTotalPages = (postventaResult as any).totalPages || 1
        postventaStats = (postventaResult as any).stats || postventaStats
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
            receipts={[]} // Obsolete, receipts are inside ledger now
            paymentStats={paymentStats as any}
            ledger={postventaLedger}
            debtAlerts={[]} // Obsolete, combined in ledger or handled in client
            postventaTotalPages={postventaTotalPages}
            postventaCurrentPage={postventaPage}
            postventaSearch={postventaSearch}
            postventaStage={postventaStage}
            postventaStatus={postventaStatus}
            postventaStats={postventaStats}
            initialMobileTab={searchParams.mobileTab}
        />
    )
}
