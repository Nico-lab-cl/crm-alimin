import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🚀 Iniciando sincronización de recibos...')
  
  const reservations = await prisma.reservation.findMany({
    where: { buyer_id: { not: null } },
    include: { 
      lot: true,
      receipts: {
        where: { status: 'APPROVED' }
      }
    }
  })

  let syncedCount = 0

  for (const res of reservations) {
    console.log(`Checking client: ${res.name} (Lot ${res.lot.number})`)

    // 1. Sync Pie if PAID but no record
    if (res.pie_status === 'PAID') {
      const hasPieReceipt = res.receipts.some(r => r.scope === 'PIE')
      if (!hasPieReceipt) {
        await prisma.paymentReceipt.create({
          data: {
            amount_clp: res.lot.pie || 0,
            status: 'APPROVED',
            receipt_url: 'LEGACY_SYNC',
            scope: 'PIE',
            reservation_id: res.id,
            lot_id: res.lot_id,
            processed_at: new Date('2026-03-11') // As requested: today 11 March 2026
          }
        })
        syncedCount++
        console.log(`  + Created Pie receipt for ${res.name}`)
      }
    }

    // 2. Sync installments_paid
    const paidCount = res.installments_paid || 0
    const existingCuotasReceipts = res.receipts.filter(r => r.scope === 'INSTALLMENT').length
    
    if (paidCount > existingCuotasReceipts) {
      const toSync = paidCount - existingCuotasReceipts
      for (let i = 0; i < toSync; i++) {
        const cuotaNum = existingCuotasReceipts + i + 1
        
        await prisma.paymentReceipt.create({
          data: {
            amount_clp: res.lot.valor_cuota || 0,
            status: 'APPROVED',
            receipt_url: 'LEGACY_SYNC',
            scope: 'INSTALLMENT',
            installments_count: cuotaNum,
            reservation_id: res.id,
            lot_id: res.lot_id,
            processed_at: new Date('2026-03-11') // As requested: today 11 March 2026
          }
        })
        syncedCount++
        console.log(`  + Created Cuota #${cuotaNum} receipt for ${res.name}`)
      }
    }
  }

  console.log(`✅ Sincronización finalizada. Total creados: ${syncedCount}`)
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
