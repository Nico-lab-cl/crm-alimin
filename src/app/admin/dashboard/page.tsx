import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { getAdminPipeline, getSellers, getAdminLots, getAdminUsers, getAdminStats } from "@/actions/dashboard"
import { getPostventaData } from "@/actions/postventa"
import { AdminDashboardClient } from "./AdminDashboardClient"

const POSTVENTA_EMAIL = 'postventa@lomasdelmar.cl';

export default async function AdminDashboard() {
    const session = await auth()
    const userEmail = session?.user?.email || ''

    const isPostventa = userEmail === POSTVENTA_EMAIL

    const [pipelineResult, sellersResult, lotsResult, usersResult, statsResult, postventaData] = await Promise.all([
        getAdminPipeline(),
        getSellers(),
        getAdminLots(),
        getAdminUsers(),
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
        // Extract receipts from ledger to avoid duplicate queries
        receipts = ledger.flatMap(entry => entry.receipts || [])
    }

    return (
        <AdminDashboardClient
            pipelineData={(pipelineResult as any).data || []}
            sellers={(sellersResult as any).data || []}
            lots={(lotsResult as any).data || []}
            users={(usersResult as any).data || []}
            userEmail={userEmail}
            receipts={receipts}
            paymentStats={paymentStats as any}
            ledger={ledger}
            debtAlerts={debtAlerts}
        />
    )
}
