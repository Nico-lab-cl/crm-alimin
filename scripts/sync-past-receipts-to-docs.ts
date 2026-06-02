import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🚀 Iniciando sincronización de recibos pasados a manual_documents...')
  
  // Find all reservations that have approved receipts
  const reservations = await prisma.reservation.findMany({
    include: {
      receipts: {
        where: { status: 'APPROVED' }
      }
    }
  })

  let totalUpdated = 0
  let totalReceiptsSynced = 0

  for (const res of reservations) {
    if (res.receipts.length === 0) continue

    let manualDocs: any[] = []
    if (res.manual_documents) {
      try {
        manualDocs = Array.isArray(res.manual_documents)
          ? (res.manual_documents as any[])
          : JSON.parse(res.manual_documents as string)
      } catch (e) {
        console.error(`Error al parsear manual_documents de reservación ${res.id}:`, e)
      }
    }

    let modified = false
    let reservationReceiptsSynced = 0

    for (const receipt of res.receipts) {
      const pdfUrl = `/api/receipt/${receipt.id}/pdf`
      
      // Check if it already exists
      const alreadyExists = manualDocs.some((doc: any) => doc.url === pdfUrl || doc.url?.includes(receipt.id))
      if (alreadyExists) continue

      let category = 'OTRO'
      let docName = 'Comprobante'
      if (receipt.scope === 'PIE') {
        category = 'PIE'
        docName = 'Comprobante de Pie'
      } else if (receipt.scope === 'INSTALLMENT') {
        category = 'CUOTAS'
        const num = receipt.nominal_installment_number
        const range = receipt.nominal_installment_range
        if (range) {
          docName = `Comprobante de Cuotas #${range}`
        } else if (num) {
          docName = `Comprobante de Cuota #${num}`
        } else {
          docName = `Comprobante de Cuota`
        }
      }

      manualDocs.push({
        name: `${docName}.pdf`,
        url: pdfUrl,
        category: category,
        uploadedAt: receipt.processed_at || receipt.created_at || new Date().toISOString()
      })

      modified = true
      reservationReceiptsSynced++
      totalReceiptsSynced++
    }

    if (modified) {
      await prisma.reservation.update({
        where: { id: res.id },
        data: {
          manual_documents: manualDocs
        }
      })
      totalUpdated++
      console.log(`✅ Reservación ${res.id} (Lote ${res.lot_id}) actualizada. Sincronizados: ${reservationReceiptsSynced} recibos.`)
    }
  }

  console.log(`\n🎉 Sincronización completa.`)
  console.log(`Reservaciones actualizadas: ${totalUpdated}`)
  console.log(`Recibos sincronizados: ${totalReceiptsSynced}`)
}

main()
  .catch(e => {
    console.error('Error durante la sincronización:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
