const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const res = await prisma.reservation.findFirst({
        where: { id: "705f05d5-7216-4b9e-a4d2-f6e8ae782f0f" },
        include: { 
            receipts: { orderBy: { created_at: 'asc' } }
        }
    });
    
    if (!res) {
        console.log("NOT_FOUND");
        return;
    }

    console.log(`Reservation: ${res.name} | Paid: ${res.installments_paid}`);
    res.receipts.forEach(r => {
        console.log(`Receipt: ID=${r.id} | Amount=${r.amount_clp} | Scope=${r.scope} | Status=${r.status} | Inst=${r.nominal_installment_number} | Created=${r.created_at.toISOString()}`);
    });
    await prisma.$disconnect();
}
main();
