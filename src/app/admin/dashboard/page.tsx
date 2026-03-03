import { getAdminPipeline, getSellers, getAdminLots, getAdminUsers } from "@/actions/dashboard"
import { AdminDashboardClient } from "./AdminDashboardClient"

export default async function AdminDashboard() {
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
        return res && res.buyer && l.status === 'sold'
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

    return (
        <AdminDashboardClient
            pipelineData={pipelineResult.data as any}
            sellers={sellersResult.data || []}
            lots={lotsResult.data || []}
            users={usersResult.data || []}
            paymentStats={paymentStats}
        />
    )
}
