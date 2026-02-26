const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    const availableLot = await prisma.lot.findFirst({
        where: { status: 'available' },
        select: { id: true, number: true, stage: true }
    })
    console.log(availableLot)
}

main()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect()
    })
