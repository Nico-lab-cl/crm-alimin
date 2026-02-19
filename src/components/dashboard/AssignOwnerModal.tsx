"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { assignLegacyLotOwner } from "@/actions/dashboard"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

import { REGIONES_Y_COMUNAS } from "@/data/chile-data"

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
        rut: "",
        marital_status: "",
        profession: "",
        nationality: "Chilena",
        address_street: "",
        address_number: "",
        address_commune: "",
        address_region: ""
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!lotId) return

        setLoading(true)
        try {
            const result = await assignLegacyLotOwner({
                lotId,
                ...formData
            })

            if (result.success) {
                toast.success(result.message)
                setFormData({
                    name: "", email: "", phone: "", rut: "",
                    marital_status: "", profession: "", nationality: "Chilena",
                    address_street: "", address_number: "", address_commune: "", address_region: ""
                })
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
            <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Asignar Dueño a Lote {lotNumber}</DialogTitle>
                    <DialogDescription>
                        Ingresa los datos completos del propietario para generar el contrato.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 pt-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                            <Label htmlFor="rut">RUT</Label>
                            <Input
                                id="rut"
                                required
                                placeholder="12.345.678-9"
                                value={formData.rut}
                                onChange={(e) => setFormData({ ...formData, rut: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="marital_status">Estado Civil</Label>
                            <select
                                id="marital_status"
                                required
                                value={formData.marital_status}
                                onChange={(e) => setFormData({ ...formData, marital_status: e.target.value })}
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                            >
                                <option value="" disabled>Seleccionar</option>
                                <option value="Soltero/a">Soltero/a</option>
                                <option value="Casado/a">Casado/a</option>
                                <option value="Viudo/a">Viudo/a</option>
                                <option value="Divorciado/a">Divorciado/a</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="profession">Profesión u Oficio</Label>
                            <Input
                                id="profession"
                                required
                                value={formData.profession}
                                onChange={(e) => setFormData({ ...formData, profession: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="nationality">Nacionalidad</Label>
                        <Input
                            id="nationality"
                            required
                            value={formData.nationality}
                            onChange={(e) => setFormData({ ...formData, nationality: e.target.value })}
                        />
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <div className="col-span-2 space-y-2">
                            <Label htmlFor="address_street">Calle / Pasaje</Label>
                            <Input
                                id="address_street"
                                required
                                value={formData.address_street}
                                onChange={(e) => setFormData({ ...formData, address_street: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="address_number">Número</Label>
                            <Input
                                id="address_number"
                                required
                                value={formData.address_number}
                                onChange={(e) => setFormData({ ...formData, address_number: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="address_region">Región</Label>
                            <select
                                id="address_region"
                                required
                                value={formData.address_region}
                                onChange={(e) => setFormData({ ...formData, address_region: e.target.value, address_commune: "" })}
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                            >
                                <option value="" disabled>Seleccionar Región</option>
                                {REGIONES_Y_COMUNAS.map((region) => (
                                    <option key={region.name} value={region.name}>
                                        {region.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="address_commune">Comuna</Label>
                            <select
                                id="address_commune"
                                required
                                disabled={!formData.address_region}
                                value={formData.address_commune}
                                onChange={(e) => setFormData({ ...formData, address_commune: e.target.value })}
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50"
                            >
                                <option value="" disabled>Seleccionar Comuna</option>
                                {formData.address_region &&
                                    REGIONES_Y_COMUNAS.find((r) => r.name === formData.address_region)?.communes.map((commune) => (
                                        <option key={commune} value={commune}>
                                            {commune}
                                        </option>
                                    ))}
                            </select>
                        </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-4 border-t mt-4">
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
