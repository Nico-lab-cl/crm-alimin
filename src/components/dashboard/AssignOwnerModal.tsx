"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { assignLegacyLotOwner } from "@/actions/dashboard"
import { toast } from "sonner"
import { Loader2, Calendar as CalendarIcon } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { cn } from "@/lib/utils"

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
        address_region: "",
        // Relacionado al terreno y pagos
        reservation_amount_clp: 500000,
        pie: 0,
        cuotas: 0,
        valor_cuota: 0,
        last_installment_amount: 0,
        price_total_clp: 0,
        legacy_current_installment: 1,
    })

    const [hasDebt, setHasDebt] = useState(false)
    const [debtStartDate, setDebtStartDate] = useState<Date | undefined>(undefined)
    const [installmentStartDate, setInstallmentStartDate] = useState<Date | undefined>(undefined)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!lotId) return

        setLoading(true)
        try {
            const result = await assignLegacyLotOwner({
                lotId,
                ...formData,
                legacy_installment_start_date: installmentStartDate?.toISOString(),
                legacy_debt_start_date: hasDebt ? debtStartDate?.toISOString() : undefined
            })

            if (result.success) {
                toast.success(result.message)
                setFormData({
                    name: "", email: "", phone: "", rut: "",
                    marital_status: "", profession: "", nationality: "Chilena",
                    address_street: "", address_number: "", address_commune: "", address_region: "",
                    reservation_amount_clp: 500000, pie: 0, cuotas: 0, valor_cuota: 0, last_installment_amount: 0, price_total_clp: 0, legacy_current_installment: 1
                })
                setHasDebt(false)
                setDebtStartDate(undefined)
                setInstallmentStartDate(undefined)
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

                                value={formData.profession}
                                onChange={(e) => setFormData({ ...formData, profession: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="nationality">Nacionalidad</Label>
                        <Input
                            id="nationality"

                            value={formData.nationality}
                            onChange={(e) => setFormData({ ...formData, nationality: e.target.value })}
                        />
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <div className="col-span-2 space-y-2">
                            <Label htmlFor="address_street">Calle / Pasaje</Label>
                            <Input
                                id="address_street"

                                value={formData.address_street}
                                onChange={(e) => setFormData({ ...formData, address_street: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="address_number">Número</Label>
                            <Input
                                id="address_number"

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

                    <hr className="my-4 border-gray-200" />

                    <h3 className="font-bold text-lg text-[#36595F]">Datos Financieros del Contrato</h3>
                    <p className="text-sm text-gray-500 mb-4">Ingresa los valores exactos definidos en la compra offline.</p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="price_total_clp">Valor Total Terreno (CLP)</Label>
                            <Input
                                id="price_total_clp"
                                type="number"
                                required
                                value={formData.price_total_clp === 0 ? "" : formData.price_total_clp}
                                onChange={(e) => setFormData({ ...formData, price_total_clp: Number(e.target.value) })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="reservation_amount_clp">Monto Reserva (CLP)</Label>
                            <Input
                                id="reservation_amount_clp"
                                type="number"
                                required
                                value={formData.reservation_amount_clp === 0 ? "" : formData.reservation_amount_clp}
                                onChange={(e) => setFormData({ ...formData, reservation_amount_clp: Number(e.target.value) })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="pie">Monto Pie Pagado (CLP)</Label>
                            <Input
                                id="pie"
                                type="number"
                                required
                                value={formData.pie === 0 ? "" : formData.pie}
                                onChange={(e) => setFormData({ ...formData, pie: Number(e.target.value) })}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="cuotas">Total de Cuotas</Label>
                            <Input
                                id="cuotas"
                                type="number"
                                required
                                value={formData.cuotas === 0 ? "" : formData.cuotas}
                                onChange={(e) => setFormData({ ...formData, cuotas: Number(e.target.value) })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="valor_cuota">Valor Cuota Normal (CLP)</Label>
                            <Input
                                id="valor_cuota"
                                type="number"
                                required
                                value={formData.valor_cuota === 0 ? "" : formData.valor_cuota}
                                onChange={(e) => setFormData({ ...formData, valor_cuota: Number(e.target.value) })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="last_installment_amount">Valor Última Cuota (CLP)</Label>
                            <Input
                                id="last_installment_amount"
                                type="number"
                                required
                                value={formData.last_installment_amount === 0 ? "" : formData.last_installment_amount}
                                onChange={(e) => setFormData({ ...formData, last_installment_amount: Number(e.target.value) })}
                            />
                        </div>
                    </div>

                    <div className="bg-blue-50/50 p-4 rounded-lg border border-blue-100 space-y-4">
                        <h4 className="font-semibold text-blue-900 border-b border-blue-200 pb-2">Estado de Pagos Actual</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="legacy_current_installment">Cuotas ya pagadas por el cliente</Label>
                                <Input
                                    id="legacy_current_installment"
                                    type="number"
                                    min="0"
                                    required
                                    value={formData.legacy_current_installment}
                                    onChange={(e) => setFormData({ ...formData, legacy_current_installment: Number(e.target.value) })}
                                />
                                <p className="text-xs text-blue-600">Ej: Si pagó 5 cuotas (Ene-May), pon 5. La próxima será la 6.</p>
                            </div>

                            <div className="space-y-2">
                                <Label>Fecha Inicio de Cuotas</Label>
                                <p className="text-xs text-gray-500">Mes ANTERIOR al de la primera cuota. Ej: si la cuota 1 fue en Enero, selecciona Diciembre.</p>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            className={cn(
                                                "w-full justify-start text-left font-normal",
                                                !installmentStartDate && "text-muted-foreground"
                                            )}
                                        >
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {installmentStartDate ? format(installmentStartDate, "MM/yyyy", { locale: es }) : <span>Seleccionar mes base</span>}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={installmentStartDate}
                                            onSelect={setInstallmentStartDate}
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                            </div>
                        </div>

                        <div className="space-y-3 pt-2 border-t border-blue-200">
                            <Label>¿Este cliente presenta deuda previa (mora)?</Label>
                            <div className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    id="hasDebt"
                                    checked={hasDebt}
                                    onChange={(e) => setHasDebt(e.target.checked)}
                                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                                <label htmlFor="hasDebt" className="text-sm font-medium text-gray-700">
                                    Viene con mora acumulada
                                </label>
                            </div>

                            {hasDebt && (
                                <div className="pt-2">
                                    <Label className="block mb-2 text-xs">Fecha desde que dejó de pagar</Label>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                                type="button"
                                                variant={"outline"}
                                                className={cn(
                                                    "w-full justify-start text-left font-normal",
                                                    !debtStartDate && "text-muted-foreground"
                                                )}
                                            >
                                                <CalendarIcon className="mr-2 h-4 w-4" />
                                                {debtStartDate ? format(debtStartDate, "PPP", { locale: es }) : <span>Seleccionar Inicio Mora</span>}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                            <Calendar
                                                mode="single"
                                                selected={debtStartDate}
                                                onSelect={setDebtStartDate}
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                </div>
                            )}
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
