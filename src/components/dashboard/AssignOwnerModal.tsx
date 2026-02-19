"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { assignLegacyLotOwner } from "@/actions/dashboard"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

interface AssignOwnerModalProps {
    lotId: number | null
    lotNumber: string | null
    open: boolean
    onOpenChange: (open: boolean) => void
    onSuccess: () => void
}

export function AssignOwnerModal({ lotId, lotNumber, open, onOpenChange, onSuccess }: AssignOwnerModalProps) {
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        rut: ""
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!lotId) return

        setLoading(true)
        try {
            const result = await assignLegacyLotOwner({
                lotId,
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                rut: formData.rut
            })

            if (result.success) {
                toast.success(result.message)
                setFormData({ name: "", email: "", phone: "", rut: "" })
                onSuccess()
                onOpenChange(false)
            } else {
                toast.error(result.error || "Error al asignar dueño")
            }
        } catch (error) {
            toast.error("Ocurrió un error inesperado")
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Asignar Dueño a Lote {lotNumber}</DialogTitle>
                    <DialogDescription>
                        Ingresa los datos del propietario para este lote vendido.
                        Si el correo es nuevo, se creará una cuenta y se enviará contraseña temporal.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 pt-2">
                    <div className="space-y-2">
                        <Label htmlFor="name">Nombre Completo</Label>
                        <Input
                            id="name"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email">Correo Electrónico</Label>
                        <Input
                            id="email"
                            type="email"
                            required
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="phone">Teléfono</Label>
                            <Input
                                id="phone"
                                required
                                placeholder="+569..."
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="rut">RUT (Opcional)</Label>
                            <Input
                                id="rut"
                                placeholder="12.345.678-9"
                                value={formData.rut}
                                onChange={(e) => setFormData({ ...formData, rut: e.target.value })}
                            />
                        </div>
                    </div>
                    <div className="flex justify-end gap-2 pt-4">
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Cancelar
                        </Button>
                        <Button type="submit" className="bg-[#36595F] text-white hover:bg-[#2A464B]" disabled={loading}>
                            {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                            Asignar Dueño
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
