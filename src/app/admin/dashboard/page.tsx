import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { getAdminPipeline, getSellers, getAdminLots, getAdminUsers } from "@/actions/dashboard"
import { getPostventaData } from "@/actions/postventa"
import { AdminDashboardClient } from "./AdminDashboardClient"

const POSTVENTA_EMAIL = 'postventa@lomasdelmar.cl';

export default async function AdminDashboard() {
    const session = await auth()
    const userEmail = session?.user?.email || ''

    const [pipelineResult, sellersResult, lotsResult, usersResult] = await Promise.all([
        getAdminPipeline(),
        getSellers(),
        getAdminLots(),
        getAdminUsers()
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

    if (userEmail === POSTVENTA_EMAIL) {
        try {
            const postventaData = await getPostventaData()

            if (postventaData.success) {
                ledger = postventaData.ledger || []
                debtAlerts = postventaData.debtAlerts || []

                // Extract receipts from ledger to avoid duplicate queries
                const allReceipts = ledger.flatMap(entry => entry.receipts || [])
                receipts = allReceipts
            }
        } catch (e) {
            console.error('Error fetching data for postventa:', e)
        }
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
