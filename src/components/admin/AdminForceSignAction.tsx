"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, ShieldAlert, Key } from "lucide-react"
import { toast } from "sonner"
import { adminForceSignContract, adminResetUserPassword } from "@/actions/dashboard"

interface AdminForceSignActionProps {
    reservationId: string
    userId?: string | null
    clientName: string
    isReservaSigned: boolean
    isPromesaSigned: boolean
}

export function AdminForceSignAction({ reservationId, userId, clientName, isReservaSigned, isPromesaSigned }: AdminForceSignActionProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [isSigningReserva, setIsSigningReserva] = useState(false)
    const [isSigningPromesa, setIsSigningPromesa] = useState(false)
    const [isChangingPassword, setIsChangingPassword] = useState(false)
    const [newPassword, setNewPassword] = useState("")

    const handleForceSign = async (type: 'RESERVA' | 'PROMESA') => {
        if (!confirm(`¿Estás seguro de forzar la firma digital de la ${type} para ${clientName}? Esto registrará tu IP como autorizante.`)) return;

        type === 'RESERVA' ? setIsSigningReserva(true) : setIsSigningPromesa(true)

        try {
            const res = await adminForceSignContract(reservationId, type)
            if (res.error) throw new Error(res.error)
            toast.success(res.message)
            setIsOpen(false)
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Error al forzar la firma")
        } finally {
            type === 'RESERVA' ? setIsSigningReserva(false) : setIsSigningPromesa(false)
        }
    }

    const handlePasswordReset = async () => {
        if (!userId) return toast.error("Usuario no encontrado")
        if (newPassword.length < 6) return toast.error("La contraseña debe tener al menos 6 caracteres")

        setIsChangingPassword(true)
        try {
            const res = await adminResetUserPassword(userId, newPassword)
            if (res.error) throw new Error(res.error)
            toast.success("Contraseña temporal generada con éxito. El usuario deberá cambiarla al ingresar.")
            setNewPassword("")
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Error al cambiar contraseña")
        } finally {
            setIsChangingPassword(false)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="w-full mt-2 border-orange-200 text-orange-700 hover:bg-orange-50 hover:text-orange-800">
                    <ShieldAlert className="w-4 h-4 mr-2" />
                    Asistencia Cliente (Old School)
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Asistencia Manual: {clientName}</DialogTitle>
                    <DialogDescription>
                        Opciones para clientes que no pueden completar el proceso digital por sí mismos.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    {/* Firmas Digitales */}
                    <div className="space-y-3">
                        <Label className="text-sm font-bold">Forzar Firmas Digitales</Label>
                        <p className="text-xs text-muted-foreground mb-2">
                            Aplica la firma digital en nombre del cliente si este ya aceptó el documento por WhatsApp o correo.
                        </p>

                        <div className="flex gap-2">
                            <Button
                                variant={isReservaSigned ? "secondary" : "default"}
                                disabled={isReservaSigned || isSigningReserva}
                                onClick={() => handleForceSign('RESERVA')}
                                className="flex-1"
                            >
                                {isSigningReserva && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                                {isReservaSigned ? "Reserva Firmada" : "Firmar Reserva"}
                            </Button>

                            <Button
                                variant={isPromesaSigned ? "secondary" : "default"}
                                disabled={isPromesaSigned || isSigningPromesa}
                                onClick={() => handleForceSign('PROMESA')}
                                className="flex-1"
                            >
                                {isSigningPromesa && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                                {isPromesaSigned ? "Promesa Firmada" : "Firmar Promesa"}
                            </Button>
                        </div>
                    </div>

                    <div className="border-t pt-4" />

                    {/* Reset Password */}
                    <div className="space-y-3">
                        <Label className="text-sm font-bold flex items-center gap-2">
                            <Key className="w-4 h-4" />
                            Generar Contraseña Temporal
                        </Label>
                        <p className="text-xs text-muted-foreground mb-2">
                            Asigna una contraseña temporal para que el cliente pueda entrar a su portal. El sistema lo obligará a cambiarla inmediatamente después de hacer login.
                        </p>

                        {userId ? (
                            <div className="flex gap-2">
                                <Input
                                    type="text"
                                    placeholder="Ej: Lomas2026"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                />
                                <Button
                                    onClick={handlePasswordReset}
                                    disabled={isChangingPassword || newPassword.length < 6}
                                >
                                    {isChangingPassword ? <Loader2 className="w-4 h-4 animate-spin" /> : "Generar"}
                                </Button>
                            </div>
                        ) : (
                            <p className="text-xs text-red-500">El cliente aún no tiene un usuario creado en la plataforma.</p>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
