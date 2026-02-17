'use server'

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { Role } from "@prisma/client"
import { logAdminAction } from "@/lib/logger"

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
            orderBy: { number: 'asc' }
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
                    select: { id: true, status: true, folio: true }
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
