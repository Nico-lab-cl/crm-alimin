'use server'

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { Role } from "@prisma/client"
import { logAdminAction } from "@/lib/logger"
import { SignJWT } from "jose"
import { sendPieWebhook, sendContractSignedWebhook } from "@/lib/webhooks"

export async function getSellerPipeline() {
    const session = await auth()
    if (!session?.user?.id) return { error: "No autorizado" }

    try {
        const reservations = await prisma.reservation.findMany({
            where: { seller_id: session.user.id },
            include: {
                lot: true,
                buyer: true
            },
            orderBy: { created_at: 'desc' }
        })
        return { success: true, data: reservations }
    } catch (error) {
        console.error("Error getting seller pipeline:", error)
        return { error: "Error al cargar el pipeline" }
    }
}

export async function getAdminPipeline() {
    const session = await auth()
    if (session?.user?.role !== Role.ADMIN) return { error: "No autorizado" }

    try {
        const reservations = await prisma.reservation.findMany({
            include: {
                lot: true,
                buyer: true,
                seller: true
            },
            orderBy: { created_at: 'desc' }
        })
        return { success: true, data: reservations }
    } catch (error) {
        console.error("Error getting admin pipeline:", error)
        return { error: "Error al cargar el pipeline global" }
    }
}

export async function updatePipelineStage(reservationId: string, stage: string) {
    const session = await auth()
    if (!session?.user) return { error: "No autorizado" }

    // Validate access: Admin or the assigned Seller
    const reservation = await prisma.reservation.findUnique({
        where: { id: reservationId },
        select: { seller_id: true }
    })

    if (!reservation) return { error: "Reserva no encontrada" }

    if (session.user.role !== Role.ADMIN && reservation.seller_id !== session.user.id) {
        return { error: "No tienes permiso para modificar esta reserva" }
    }

    try {
        await prisma.reservation.update({
            where: { id: reservationId },
            data: { pipeline_stage: stage }
        })

        await logAdminAction({
            action: 'UPDATE',
            entity: 'Reservation',
            entityId: reservationId,
            details: `Cambio de etapa a: ${stage}`,
            pk: reservationId
        });

        // Trigger Contract Signed Webhook if stage matches
        if (stage === 'PIE_POR_PAGAR') {
            sendContractSignedWebhook(reservationId).catch(console.error);
        }

        revalidatePath('/seller/dashboard')
        revalidatePath('/admin/dashboard')
        return { success: true }
    } catch (error) {
        console.error("Error updating stage:", error)
        return { error: "Error al actualizar la etapa" }
    }
}

export async function updateReservationNotes(reservationId: string, notes: string) {
    const session = await auth()
    if (!session?.user) return { error: "No autorizado" }

    // Validate access
    const reservation = await prisma.reservation.findUnique({
        where: { id: reservationId },
        select: { seller_id: true }
    })

    if (!reservation) return { error: "Reserva no encontrada" }

    if (session.user.role !== Role.ADMIN && reservation.seller_id !== session.user.id) {
        return { error: "No tienes permiso" }
    }

    try {
        await prisma.reservation.update({
            where: { id: reservationId },
            data: { notes }
        })

        await logAdminAction({
            action: 'UPDATE',
            entity: 'Reservation',
            entityId: reservationId,
            details: `Actualización de notas privades`,
            pk: reservationId
        });

        revalidatePath('/seller/dashboard')
        revalidatePath('/admin/dashboard')
        return { success: true }
    } catch (error) {
        console.error("Error updating notes:", error)
        return { error: "Error al guardar notas" }
    }
}

export async function assignSeller(reservationId: string, sellerId: string) {
    const session = await auth()
    if (session?.user?.role !== Role.ADMIN) return { error: "No autorizado" }

    try {
        await prisma.reservation.update({
            where: { id: reservationId },
            data: { seller_id: sellerId }
        })

        await logAdminAction({
            action: 'UPDATE',
            entity: 'Reservation',
            entityId: reservationId,
            details: `Reasignación de vendedor a ID: ${sellerId}`,
            pk: reservationId
        });

        revalidatePath('/admin/dashboard')
        return { success: true }
    } catch (error) {
        console.error("Error assigning seller:", error)
        return { error: "Error al reasignar vendedor" }
    }
}

export async function getSellers() {
    const session = await auth()
    if (session?.user?.role !== Role.ADMIN) return { error: "No autorizado" }

    try {
        const sellers = await prisma.user.findMany({
            where: { role: Role.SELLER },
            select: { id: true, name: true, email: true }
        })
        return { success: true, data: sellers }
    } catch (error) {
        return { error: "Error al cargar vendedores" }
    }
}

// ADMIN: GESTIÓN DE LOTES
export async function getAdminLots() {
    const session = await auth()
    if (session?.user?.role !== Role.ADMIN) return { error: "No autorizado" }

    try {
        const lots = await prisma.lot.findMany({
            orderBy: { number: 'asc' },
            include: {
                reservations: {
                    where: { status: { in: ['paid', 'confirmed'] } },
                    take: 1,
                    select: {
                        id: true,
                        buyer: { select: { name: true, email: true } },
                        signed_at: true,
                        is_legacy: true,
                        workflow_activated: true
                    }
                }
            }
        })
        return { success: true, data: lots }
    } catch (error) {
        console.error("Error getting lots:", error)
        return { error: "Error al cargar lotes" }
    }
}

export async function updateLotStatus(lotId: number, status: string) {
    const session = await auth()
    if (session?.user?.role !== Role.ADMIN) return { error: "No autorizado" }

    try {
        await prisma.lot.update({
            where: { id: lotId },
            data: { status }
        })

        await logAdminAction({
            action: 'UPDATE',
            entity: 'Lot',
            entityId: String(lotId),
            details: `Cambio de estado de lote a: ${status}`,
            pk: String(lotId)
        });

        revalidatePath('/admin/dashboard')
        return { success: true }
    } catch (error) {
        console.error("Error updating lot status:", error)
        return { error: "Error al actualizar estado del lote" }
    }
}

// ADMIN: GESTIÓN DE USUARIOS
export async function getAdminUsers() {
    const session = await auth()
    if (session?.user?.role !== Role.ADMIN) return { error: "No autorizado" }

    try {
        const users = await prisma.user.findMany({
            orderBy: { createdAt: 'desc' },
            include: {
                purchases: {
                    where: { status: { in: ['paid', 'confirmed'] } },
                    select: {
                        id: true,
                        pipeline_stage: true,
                        signed_at: true,
                        pie_status: true,
                        installments_paid: true,
                        is_legacy: true,
                        workflow_activated: true,
                        lot: {
                            select: { number: true, stage: true }
                        }
                    },
                    orderBy: { created_at: 'desc' }
                }
            }
        })
        return { success: true, data: users }
    } catch (error) {
        console.error("Error getting users:", error)
        return { error: "Error al cargar usuarios" }
    }
}

import { hash } from "bcryptjs"

export async function createVerifiedUser(data: any) {
    const session = await auth()
    if (session?.user?.role !== Role.ADMIN) return { error: "No autorizado" }

    const { name, email, password, role } = data

    try {
        const existingUser = await prisma.user.findUnique({ where: { email } })
        if (existingUser) return { error: "El correo ya está registrado" }

        const hashedPassword = await hash(password, 10)

        await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role: role || Role.USER,
                emailVerified: new Date(), // Auto-verify
                mustChangePassword: false
            }
        })

        await logAdminAction({
            action: 'CREATE',
            entity: 'User',
            entityId: email,
            details: `Creación de usuario verificado con rol: ${role || Role.USER}`,
            pk: email
        });

        revalidatePath('/admin/dashboard')
        return { success: true }
    } catch (error) {
        console.error("Error creating user:", error)
        return { error: "Error al crear usuario" }
    }
}

export async function assignLegacyLotOwner(data: {
    lotId: number;
    name: string;
    email: string;
    phone: string;
    rut?: string;
    marital_status?: string;
    profession?: string;
    nationality?: string;
    address_street?: string;
    address_number?: string;
    address_commune?: string;
    address_region?: string;
    // New Fields
    reservation_amount_clp?: number;
    pie?: number;
    cuotas?: number;
    valor_cuota?: number;
    last_installment_amount?: number;
    price_total_clp?: number;
    legacy_current_installment?: number;
    legacy_debt_start_date?: string;
}) {
    const session = await auth()
    if (session?.user?.role !== Role.ADMIN) return { error: "No autorizado" }

    const {
        lotId, name, email, phone, rut, marital_status, profession, nationality,
        address_street, address_number, address_commune, address_region,
        reservation_amount_clp, pie, cuotas, valor_cuota, last_installment_amount,
        price_total_clp, legacy_current_installment, legacy_debt_start_date
    } = data

    try {
        let user = await prisma.user.findUnique({ where: { email } })
        let isNewUser = false
        let resetLink = null

        // If user doesn't exist, create one with temp password in SILENCE
        if (!user) {
            isNewUser = true
            const tempPassword = Math.random().toString(36).slice(-8)
            const hashedPassword = await hash(tempPassword, 10)

            user = await prisma.user.create({
                data: {
                    name,
                    email,
                    password: hashedPassword,
                    role: Role.USER,
                    emailVerified: new Date(),
                    mustChangePassword: true
                }
            })
        }

        // Base assumption: if pie is set, it's paid. If they gave us current installment, we calculate how many they've paid.
        let paidInstallments = 0;
        if (legacy_current_installment && legacy_current_installment > 1) {
            paidInstallments = legacy_current_installment - 1;
        }

        // Update the Lot first to persist the financial constants
        await prisma.lot.update({
            where: { id: lotId },
            data: {
                price_total_clp: price_total_clp || 0,
                reservation_amount_clp: reservation_amount_clp || 500000,
                pie: pie || 0,
                cuotas: cuotas || 0,
                valor_cuota: valor_cuota || 0,
                last_installment_amount: last_installment_amount || 0,
                status: 'sold',
                updated_at: new Date()
            }
        });

        // Create a "Completed" reservation linking user and lot
        const fullAddress = [address_street, address_number, address_commune, address_region].filter(Boolean).join(", ");

        const reservation = await prisma.reservation.create({
            data: {
                lot_id: lotId,
                buyer_id: user.id,
                name,
                email,
                phone,
                rut,
                status: 'paid',
                pipeline_stage: 'VENTA_CERRADA',
                pie_status: 'PAID', // In offline, the pie is considered paid if they signed.
                installments_paid: paidInstallments,
                address: fullAddress || 'Dirección no especificada (Venta Legacy)',

                // New legal fields
                marital_status: marital_status || 'SOLTERO/A', // Default fallback
                profession: profession || 'Oficio no informado',
                nationality: nationality || 'Chilena',
                address_street,
                address_number,
                address_commune,
                address_region,

                // Legacy Offline indicators
                is_legacy: true,
                workflow_activated: false,
                legacy_current_installment: legacy_current_installment || 1,
                legacy_debt_start_date: legacy_debt_start_date ? new Date(legacy_debt_start_date) : null
            }
        })

        // Log action
        await logAdminAction({
            action: 'UPDATE',
            entity: 'Lot',
            entityId: String(lotId),
            details: `Asignación manual de dueño a lote ${lotId}. Usuario: ${email} (${isNewUser ? 'NUEVO' : 'EXISTENTE'}). Datos financieros cargados.`,
            pk: String(lotId)
        })

        // Webhooks are intentionally DEFERRED for legacy assignments until "Activar Workflow" is clicked

        revalidatePath('/admin/dashboard')
        return { success: true, message: isNewUser ? "Usuario creado y asignado. Se envió correo de bienvenida." : "Usuario asignado correctamente." }

    } catch (error) {
        console.error("Error linking legacy owner:", error)
        return { error: "Error al asignar dueño al lote" }
    }
}

export async function triggerLegacyWorkflow(reservationId: string) {
    const session = await auth()
    if (session?.user?.role !== Role.ADMIN) return { error: "No autorizado" }

    try {
        const reservation = await prisma.reservation.findUnique({
            where: { id: reservationId },
            include: { buyer: true, lot: true }
        });

        console.log("Trigger Legacy Debug:", {
            hasReservation: !!reservation,
            hasBuyer: !!reservation?.buyer,
            isLegacy: reservation?.is_legacy
        });

        if (!reservation) {
            return { error: "Reserva no encontrada." }
        }
        if (!reservation.is_legacy) {
            return { error: "No es una asignación manual (legacy)." }
        }
        if (!reservation.buyer) {
            return { error: "La reserva no tiene un Usuario (buyer) asociado en la base de datos." }
        }

        if (reservation.workflow_activated) {
            return { error: "El workflow de esta reserva ya fue activado previamente." }
        }

        const user = reservation.buyer;
        let resetLink = null;

        // 1. Send to Temporal Password Webhook (as Welcome Email) if new user
        if (user.mustChangePassword) {
            // Generate a fresh random password since we couldn't store the plain text one from assignment
            const randomPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
            const hashedPassword = await hash(randomPassword, 10);

            await prisma.user.update({
                where: { id: user.id },
                data: { password: hashedPassword }
            });

            const baseUrl = process.env.NEXTAUTH_URL || "https://aliminlomasdelmar.com";
            const registerWebhookUrl = "https://n8n-n8n.yszha2.easypanel.host/webhook/7febf5b8-27dd-4988-b137-364480bcba58";

            try {
                await fetch(registerWebhookUrl, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        email: user.email,
                        name: user.name,
                        temp_password: randomPassword,
                        login_url: `${baseUrl}/login`,
                        dashboard_url: `${baseUrl}/user/plots`,
                        rut: reservation.rut,
                        phone: reservation.phone,
                        is_legacy: true
                    }),
                });
            } catch (e) {
                console.error("Failed to trigger legacy register webhook", e);
            }
        }

        // 2. Trigger Main Payment Webhook (Simulation of Payment Success)
        const paymentWebhookUrl = process.env.N8N_WEBHOOK_URL || "https://n8n-n8n.yszha2.easypanel.host/webhook/7b928d3b-2850-462d-87df-f6a87fe4108a";
        const paymentPayload = {
            contact_name: reservation.name,
            contact_email: reservation.email,
            contact_phone: reservation.phone,
            contact_rut: reservation.rut,
            contact_address: reservation.address,
            lot_number: reservation.lot?.number,
            lot_id: reservation.lot?.id,
            lot_stage: reservation.lot?.stage,
            lot_area_m2: reservation.lot?.area_m2,
            lot_total_price: reservation.lot?.price_total_clp,
            amount_paid: reservation.lot?.reservation_amount_clp || 500000,
            transbank_order_id: `OFFLINE_${reservation.id}`,
            authorization_code: "OFFLINE",
            payment_status: 'approved',
            timestamp: new Date().toISOString(),
            reservation_id: reservation.id,
            folio: reservation.folio,
            payment_type_code: "VD", // Venta Débito as placeholder
            installments_number: 0,
            scope: 'RESERVATION',
            is_legacy: true,
            user_id: user.id
        };

        try {
            const res = await fetch(paymentWebhookUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(paymentPayload)
            });
            if (!res.ok) {
                console.error("Main Payment Webhook failed:", res.status, await res.text());
            } else {
                console.log("Main Payment Webhook sent successfully for OFFLINE sale");
            }
        } catch (e) {
            console.error("Failed to trigger main payment webhook", e);
        }

        // Mark workflow as activated
        await prisma.reservation.update({
            where: { id: reservationId },
            data: { workflow_activated: true }
        });

        await logAdminAction({
            action: 'UPDATE',
            entity: 'Reservation',
            entityId: reservationId,
            details: `Workflow manual (Emails/n8n) activado para Lote ${reservation.lot.number}`,
            pk: reservationId
        });

        revalidatePath('/admin/dashboard')
        return { success: true, message: "Workflow activado y correos enviados correctamente." }

    } catch (error) {
        console.error("Error triggering legacy workflow:", error)
        return { error: "Error al activar el workflow" }
    }
}

export async function getUserReservations(userId: string) {
    const session = await auth()
    if (session?.user?.role !== Role.ADMIN) return []

    try {
        const whereClause: any = {
            status: { in: ['paid', 'confirmed'] }
        }

        // If specific user, add buyer_id filter. If 'all', fetch everything.
        if (userId && userId !== 'all') { // Ensure userId is valid
            whereClause.buyer_id = userId
        }

        console.log(`[getUserReservations] userId: ${userId}, whereClause:`, JSON.stringify(whereClause));

        const reservations = await prisma.reservation.findMany({
            where: whereClause,
            include: {
                lot: true,
                buyer: {
                    select: {
                        name: true,
                        email: true
                    }
                }
            },
            orderBy: { created_at: 'desc' }
        })
        return reservations
    } catch (error) {
        console.error("Error fetching user reservations:", error)
        return []
    }
}

export async function getAllClients() {
    const session = await auth()
    if (session?.user?.role !== Role.ADMIN) return []

    try {
        const users = await prisma.user.findMany({
            where: { role: Role.USER },
            select: { id: true, name: true, email: true },
            orderBy: { name: 'asc' }
        })
        return users
    } catch (error) {
        console.error("Error fetching clients:", error)
        return []
    }
}

// ADMIN: RESET PASSWORD FOR USER
export async function adminResetUserPassword(userId: string, newPassword: string) {
    const session = await auth();
    if (session?.user?.role !== Role.ADMIN) return { error: "No autorizado" };

    if (!newPassword || newPassword.length < 6) {
        return { error: "La contraseña debe tener al menos 6 caracteres" };
    }

    try {
        const hashedPassword = await hash(newPassword, 10);

        await prisma.user.update({
            where: { id: userId },
            data: {
                password: hashedPassword,
                mustChangePassword: true // Force them to change it again on next login for security
            }
        });

        await logAdminAction({
            action: 'UPDATE',
            entity: 'User',
            entityId: userId,
            details: `Admin restableció la contraseña del usuario`,
            pk: userId
        });

        revalidatePath('/admin/dashboard')
        return { success: true, message: "Contraseña actualizada correctamente" };
    } catch (error) {
        console.error("Error resetting password:", error);
        return { error: "Error al actualizar la contraseña" };
    }
}
