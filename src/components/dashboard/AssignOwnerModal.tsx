"use client"

import { useState, useEffect } from "react"
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
    existingReservation?: any
}

export function AssignOwnerModal({ lotId, lotNumber, open, onOpenChange, onSuccess, existingReservation }: AssignOwnerModalProps) {
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
        isPiePaid: true,
        reserva_firmada: false,
        compraventa_firmada: false,
        is_promo: false,
        mora_frozen: false,
    })

    const [hasDebt, setHasDebt] = useState(false)
    const [debtStartDate, setDebtStartDate] = useState<Date | undefined>(undefined)
    const [installmentStartDate, setInstallmentStartDate] = useState<Date | undefined>(undefined)
    const [installmentRanges, setInstallmentRanges] = useState<{ from: number | '', to: number | '', amount: number | '' }[]>([])

    useEffect(() => {
        if (open && existingReservation && existingReservation.buyer) {
            setFormData({
                name: existingReservation.name || existingReservation.buyer.name || "",
                email: existingReservation.email || existingReservation.buyer.email || "",
                phone: existingReservation.phone || existingReservation.buyer.phone || "",
                rut: existingReservation.rut || existingReservation.buyer.rut || "",
                marital_status: existingReservation.marital_status || "SOLTERO/A",
                profession: existingReservation.profession || "",
                nationality: existingReservation.nationality || "Chilena",
                address_street: existingReservation.address_street || "",
                address_number: existingReservation.address_number || "",
                address_commune: existingReservation.address_commune || "",
                address_region: existingReservation.address_region || "",
                reservation_amount_clp: existingReservation.lot?.reservation_amount_clp || 500000,
                pie: existingReservation.lot?.pie || 0,
                cuotas: existingReservation.lot?.cuotas || 0,
                valor_cuota: existingReservation.lot?.valor_cuota || 0,
                last_installment_amount: existingReservation.lot?.last_installment_amount || 0,
                price_total_clp: existingReservation.lot?.price_total_clp || 0,
                legacy_current_installment: existingReservation.installments_paid ? existingReservation.installments_paid + 1 : 1,
                isPiePaid: existingReservation.pie_status !== 'PENDING',
                reserva_firmada: !!existingReservation.signed_at,
                compraventa_firmada: !!existingReservation.promesa_signed_at,
                is_promo: !!existingReservation.is_promo,
                mora_frozen: !!existingReservation.mora_frozen,
            })
            if (existingReservation.legacy_debt_start_date) {
                setHasDebt(true)
                setDebtStartDate(new Date(existingReservation.legacy_debt_start_date))
            } else {
                setHasDebt(false)
                setDebtStartDate(undefined)
            }
            if (existingReservation.legacy_installment_start_date) {
                setInstallmentStartDate(new Date(existingReservation.legacy_installment_start_date))
            } else {
                setInstallmentStartDate(undefined)
            }
            if (existingReservation.legacy_installment_ranges) {
                try {
                    const parsed = typeof existingReservation.legacy_installment_ranges === 'string'
                        ? JSON.parse(existingReservation.legacy_installment_ranges)
                        : existingReservation.legacy_installment_ranges;
                    setInstallmentRanges(parsed || []);
                } catch (e) {
                    setInstallmentRanges([]);
                }
            } else {
                setInstallmentRanges([]);
            }
        } else if (open && !existingReservation) {
            // Reset if opening in create mode
            setFormData({
                name: "", email: "", phone: "", rut: "",
                marital_status: "", profession: "", nationality: "Chilena",
                address_street: "", address_number: "", address_commune: "", address_region: "",
                reservation_amount_clp: 500000, pie: 0, cuotas: 0, valor_cuota: 0, last_installment_amount: 0, price_total_clp: 0, legacy_current_installment: 1, isPiePaid: true,
                reserva_firmada: false, compraventa_firmada: false, is_promo: false, mora_frozen: false
            })
            setHasDebt(false)
            setDebtStartDate(undefined)
            setInstallmentStartDate(undefined)
            setInstallmentRanges([])
        }
    }, [open, existingReservation])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!lotId) return

        setLoading(true)
        try {
            const result = await assignLegacyLotOwner({
                lotId,
                ...formData,
                legacy_installment_start_date: installmentStartDate?.toISOString(),
                legacy_debt_start_date: hasDebt ? debtStartDate?.toISOString() : undefined,
                legacy_installment_ranges: JSON.stringify(installmentRanges.filter(r => r.from !== '' && r.to !== '' && r.amount !== '')),
                reservationId: existingReservation?.id
            })

            if (result.success) {
                toast.success(result.message)
                setFormData({
                    name: "", email: "", phone: "", rut: "",
                    marital_status: "", profession: "", nationality: "Chilena",
                    address_street: "", address_number: "", address_commune: "", address_region: "",
                    reservation_amount_clp: 500000, pie: 0, cuotas: 0, valor_cuota: 0, last_installment_amount: 0, price_total_clp: 0, legacy_current_installment: 1, isPiePaid: true,
                    reserva_firmada: false, compraventa_firmada: false, is_promo: false, mora_frozen: false
                })
                setHasDebt(false)
                setDebtStartDate(undefined)
                setInstallmentStartDate(undefined)
                setInstallmentRanges([])
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
                    <DialogTitle>{existingReservation ? `Editar Asignación de Lote ${lotNumber}` : `Asignar Dueño a Lote ${lotNumber}`}</DialogTitle>
                    <DialogDescription>
                        {existingReservation ? "Modifica los datos del propietario o las condiciones financieras de esta venta." : "Ingresa los datos completos del propietario para generar el contrato."}
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
                    <p className="text-sm text-gray-500 mb-4">Ingresa los valores exactos definidos en la venta.</p>

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

                    <div className="flex items-center space-x-2 bg-gray-50 border border-gray-200 p-3 rounded-md">
                        <input
                            type="checkbox"
                            id="isPiePaid"
                            className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                            checked={formData.isPiePaid}
                            onChange={(e) => setFormData({ ...formData, isPiePaid: e.target.checked })}
                        />
                        <div className="grid gap-1.5 leading-none">
                            <label
                                htmlFor="isPiePaid"
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                                ¿El Pie está completamente pagado?
                            </label>
                            <p className="text-[11px] text-gray-500">
                                Si desmarcas esta opción, el usuario podrá pagar el resto de su Pie desde la plataforma web.
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center space-x-2 bg-yellow-50 border border-yellow-200 p-3 rounded-md">
                        <input
                            type="checkbox"
                            id="is_promo"
                            className="w-4 h-4 text-yellow-600 rounded border-gray-300 focus:ring-yellow-500"
                            checked={formData.is_promo}
                            onChange={(e) => setFormData({ ...formData, is_promo: e.target.checked })}
                        />
                        <div className="grid gap-1.5 leading-none">
                            <label
                                htmlFor="is_promo"
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-yellow-900"
                            >
                                Aplica Promoción
                            </label>
                            <p className="text-[11px] text-yellow-700">
                                Marca esta opción si el cliente adquirió el terreno bajo alguna oferta o condición promocional especial.
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center space-x-2 bg-cyan-50 border border-cyan-200 p-3 rounded-md">
                        <input
                            type="checkbox"
                            id="mora_frozen"
                            className="w-4 h-4 text-cyan-600 rounded border-gray-300 focus:ring-cyan-500"
                            checked={formData.mora_frozen}
                            onChange={(e) => setFormData({ ...formData, mora_frozen: e.target.checked })}
                        />
                        <div className="grid gap-1.5 leading-none">
                            <label
                                htmlFor="mora_frozen"
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-cyan-900"
                            >
                                Congelar Mora (Eximir Cliente)
                            </label>
                            <p className="text-[11px] text-cyan-700">
                                Selecciona esto si el cliente está exento del pago de multas por atraso y notificaciones de deuda (Temporal).
                            </p>
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

                    <div className="bg-amber-50/50 p-4 rounded-lg border border-amber-100 space-y-4">
                        <div className="flex items-center justify-between border-b border-amber-200 pb-2">
                            <div>
                                <h4 className="font-semibold text-amber-900">Excepciones de Precios (Opcional)</h4>
                                <p className="text-xs text-amber-700">Si un grupo de cuotas tiene un valor diferente al normal, defínelo aquí.</p>
                            </div>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                className="text-amber-700 border-amber-300 hover:bg-amber-100"
                                onClick={() => setInstallmentRanges([...installmentRanges, { from: '', to: '', amount: '' }])}
                            >
                                + Agregar Rango Excepcional
                            </Button>
                        </div>

                        {installmentRanges.length > 0 && (
                            <div className="space-y-3">
                                {installmentRanges.map((range, index) => (
                                    <div key={index} className="flex flex-wrap md:flex-nowrap items-end gap-2 bg-white/60 p-2 rounded border border-amber-200 shadow-sm">
                                        <div className="w-full md:w-1/4 space-y-1">
                                            <Label className="text-xs text-amber-800">Desde Cuota</Label>
                                            <Input
                                                type="number"
                                                min="1"
                                                value={range.from}
                                                onChange={(e) => {
                                                    const newArr = [...installmentRanges]
                                                    newArr[index].from = e.target.value ? Number(e.target.value) : ''
                                                    setInstallmentRanges(newArr)
                                                }}
                                                placeholder="Ej: 1"
                                                required
                                            />
                                        </div>
                                        <div className="w-full md:w-1/4 space-y-1">
                                            <Label className="text-xs text-amber-800">Hasta Cuota</Label>
                                            <Input
                                                type="number"
                                                min="1"
                                                value={range.to}
                                                onChange={(e) => {
                                                    const newArr = [...installmentRanges]
                                                    newArr[index].to = e.target.value ? Number(e.target.value) : ''
                                                    setInstallmentRanges(newArr)
                                                }}
                                                placeholder="Ej: 3"
                                                required
                                            />
                                        </div>
                                        <div className="w-full md:w-2/4 space-y-1">
                                            <Label className="text-xs text-amber-800">Monto Exceptuado (CLP)</Label>
                                            <Input
                                                type="number"
                                                value={range.amount}
                                                onChange={(e) => {
                                                    const newArr = [...installmentRanges]
                                                    newArr[index].amount = e.target.value ? Number(e.target.value) : ''
                                                    setInstallmentRanges(newArr)
                                                }}
                                                placeholder="Ej: 650000"
                                                required
                                            />
                                        </div>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            className="text-red-500 hover:bg-red-50 px-2"
                                            onClick={() => {
                                                const newArr = [...installmentRanges]
                                                newArr.splice(index, 1)
                                                setInstallmentRanges(newArr)
                                            }}
                                        >
                                            X
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        )}
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
                                            {installmentStartDate ? format(installmentStartDate, "dd/MM/yyyy", { locale: es }) : <span>Seleccionar fecha base</span>}
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

                    <div className="bg-green-50/50 p-4 rounded-lg border border-green-100 space-y-4">
                        <h4 className="font-semibold text-green-900 border-b border-green-200 pb-2">Estado de Firmas (Offline)</h4>
                        <div className="flex flex-col gap-3">
                            <div className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    id="reserva_firmada"
                                    className="w-4 h-4 text-green-600 rounded border-gray-300 focus:ring-green-500"
                                    checked={formData.reserva_firmada}
                                    onChange={(e) => setFormData({ ...formData, reserva_firmada: e.target.checked })}
                                />
                                <div className="grid gap-1.5 leading-none">
                                    <label
                                        htmlFor="reserva_firmada"
                                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-green-900"
                                    >
                                        Reserva Firmada
                                    </label>
                                    <p className="text-[11px] text-green-700">
                                        Si se marca, el contrato de Reserva no aparecerá como pendiente de firma en el portal del cliente.
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    id="compraventa_firmada"
                                    className="w-4 h-4 text-green-600 rounded border-gray-300 focus:ring-green-500"
                                    checked={formData.compraventa_firmada}
                                    onChange={(e) => setFormData({ ...formData, compraventa_firmada: e.target.checked })}
                                />
                                <div className="grid gap-1.5 leading-none">
                                    <label
                                        htmlFor="compraventa_firmada"
                                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-green-900"
                                    >
                                        Promesa de Compraventa Firmada
                                    </label>
                                    <p className="text-[11px] text-green-700">
                                        Si se marca, la Promesa de Compraventa no aparecerá como pendiente de firma en el portal del cliente.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-4 border-t mt-4">
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Cancelar
                        </Button>
                        <Button type="submit" className="bg-[#36595F] text-white hover:bg-[#2A464B]" disabled={loading}>
                            {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                            {existingReservation ? "Guardar Cambios" : "Asignar Dueño"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
