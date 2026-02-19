'use server'

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { Role } from "@prisma/client"
import { logAdminAction } from "@/lib/logger"
import { SignJWT } from "jose"
import { sendPieWebhook } from "@/lib/webhooks"

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
                        signed_at: true
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
}) {
    const session = await auth()
    if (session?.user?.role !== Role.ADMIN) return { error: "No autorizado" }

    const { lotId, name, email, phone, rut, marital_status, profession, nationality, address_street, address_number, address_commune, address_region } = data

    try {
        let user = await prisma.user.findUnique({ where: { email } })
        let isNewUser = false
        let resetLink = null

        // If user doesn't exist, create one with temp password
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
                    emailVerified: new Date(), // Auto-verify legacy owners?
                    mustChangePassword: true
                }
            })

            // Generate Reset Token for "Welcome" email
            const secret = new TextEncoder().encode(process.env.AUTH_SECRET || "fallback_secret")
            const token = await new SignJWT({ email: user.email, sub: user.id })
                .setProtectedHeader({ alg: "HS256" })
                .setIssuedAt()
                .setExpirationTime("24h")
                .sign(secret)

            const baseUrl = process.env.NEXTAUTH_URL || "https://aliminlomasdelmar.com"
            resetLink = `${baseUrl}/reset-password?token=${token}`

            // Send to Password Reset Webhook (as Welcome Email)
            const webhookUrl = process.env.N8N_PASSWORD_RESET_WEBHOOK_URL
            if (webhookUrl) {
                await fetch(webhookUrl, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        email: user.email,
                        name: user.name,
                        resetLink, // Using reset link as "set password"
                        isNewLegacyUser: true, // Flag for n8n if needed
                        timestamp: new Date().toISOString(),
                    }),
                }).catch(e => console.error("Failed to trigger password webhook", e))
            }
        }

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
                pie_status: 'PAID',
                installments_paid: 0,
                address: fullAddress || 'Dirección no especificada (Venta Legacy)',

                // New legal fields
                marital_status: marital_status || 'SOLTERO/A', // Default fallback
                profession: profession || 'Oficio no informado',
                nationality: nationality || 'Chilena',
                address_street,
                address_number,
                address_commune,
                address_region
            }
        })

        // Log action
        await logAdminAction({
            action: 'UPDATE',
            entity: 'Lot',
            entityId: String(lotId),
            details: `Asignación manual de dueño a lote ${lotId}. Usuario: ${email} (${isNewUser ? 'NUEVO' : 'EXISTENTE'})`,
            pk: String(lotId)
        })

        // Confirm Lot / Legacy Sale Webhook
        // Sending Pie Webhook as "Confirmation of Acquired Lot"
        // This handles "enviarle el lote que adquirio" (via n8n)
        await sendPieWebhook(reservation.id, 0).catch(e => console.error("Failed to trigger pie webhook for legacy", e))

        revalidatePath('/admin/dashboard')
        return { success: true, message: isNewUser ? "Usuario creado y asignado. Se envió correo de bienvenida." : "Usuario asignado correctamente." }

    } catch (error) {
        console.error("Error linking legacy owner:", error)
        return { error: "Error al asignar dueño al lote" }
    }
}

export async function getUserReservations(userId: string) {
    const session = await auth()
    if (session?.user?.role !== Role.ADMIN) return []

    try {
        const reservations = await prisma.reservation.findMany({
            where: {
                buyer_id: userId,
                status: { in: ['paid', 'confirmed'] }
            },
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
