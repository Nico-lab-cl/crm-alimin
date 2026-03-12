import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { getAdminPipeline, getSellers, getAdminLots, getAdminUsers } from "@/actions/dashboard"
import { getPostventaData } from "@/actions/postventa"
import { AdminDashboardClient } from "./AdminDashboardClient"

const POSTVENTA_EMAIL = 'postventa@lomasdelmar.cl';

export default async function AdminDashboard() {
    const session = await auth()
    const userEmail = session?.user?.email || ''

    const isPostventa = userEmail === POSTVENTA_EMAIL

    const [pipelineResult, sellersResult, lotsResult, usersResult, postventaData] = await Promise.all([
        getAdminPipeline(),
        getSellers(),
        getAdminLots(),
        getAdminUsers(),
        isPostventa ? getPostventaData() : Promise.resolve({ success: false, ledger: [], debtAlerts: [] })
    ])

    if (pipelineResult.error) {
        return <div className="p-8 text-center text-red-500 font-semibold">{pipelineResult.error}</div>
    }

    // Calculate payment stats from lots data
    const lots = lotsResult.data || []
    const users = usersResult.data || []

    const soldLots = lots.filter((l: any) => l.status === 'sold')
    const lotsWithPiePaid = lots.filter((l: any) => {
        const res = l.reservations?.[0]
        return res && res.buyer && l.status === 'sold' && res.pie_status === 'PAID'
    })

    // Calculate installments from user reservations
    let totalInstallmentsPaid = 0
    users.forEach((u: any) => {
        u.purchases?.forEach((p: any) => {
            totalInstallmentsPaid += p.installments_paid || 0
        })
    })

    const paymentStats = {
        totalLots: lots.length,
        soldLots: soldLots.length,
        lotsWithPiePaid: lotsWithPiePaid.length,
        lotsWithPiePending: soldLots.length - lotsWithPiePaid.length,
        totalInstallmentsPaid,
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
            pipelineData={pipelineResult.data as any}
            sellers={sellersResult.data || []}
            lots={lotsResult.data || []}
            users={usersResult.data || []}
            userEmail={userEmail}
            receipts={receipts}
            paymentStats={paymentStats}
            ledger={ledger}
            debtAlerts={debtAlerts}
        />
    )
}
