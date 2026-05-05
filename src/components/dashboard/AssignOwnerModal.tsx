"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { assignLegacyLotOwner, impersonateUser } from "@/actions/dashboard"
import { toast } from "sonner"
import { Loader2, Calendar as CalendarIcon, Eye } from "lucide-react"
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
    const [impersonating, setImpersonating] = useState(false)
    const [formData, setFormData] = useState({
        name: "",
        last_name: "",
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
        legacy_current_installment: 0,
        isPiePaid: true,
        reserva_firmada: false,
        compraventa_firmada: false,
        is_promo: false,
        mora_frozen: false,
        advisor: "",
        observation: "",
        extra_paid_amount: 0,
        pending_amount: 0,
        has_operational_expenses: false,
        next_installment_discount: 0,
    })

    const [hasDebt, setHasDebt] = useState(false)
    const [debtStartDate, setDebtStartDate] = useState<Date | undefined>(undefined)
    const [debtEndDate, setDebtEndDate] = useState<Date | undefined>(undefined)
    const [installmentStartDate, setInstallmentStartDate] = useState<Date | undefined>(undefined)
    const [nextPaymentDate, setNextPaymentDate] = useState<Date | undefined>(undefined)
    const [installmentRanges, setInstallmentRanges] = useState<{ from: number | '', to: number | '', amount: number | '' }[]>([])

    useEffect(() => {
        if (open && existingReservation && (existingReservation.buyer || existingReservation.name)) {
            setFormData({
                name: existingReservation.name || existingReservation.buyer?.name || "",
                last_name: existingReservation.last_name || "",
                email: existingReservation.email || existingReservation.buyer?.email || "",
                phone: existingReservation.phone || existingReservation.clientPhone || existingReservation.buyer?.phone || "",
                rut: existingReservation.rut || existingReservation.buyer?.rut || "",
                marital_status: existingReservation.marital_status || "SOLTERO/A",
                profession: existingReservation.profession || "",
                nationality: existingReservation.nationality || "Chilena",
                address_street: existingReservation.address_street || "",
                address_number: existingReservation.address_number || "",
                address_commune: existingReservation.address_commune || "",
                address_region: existingReservation.address_region || "",
                reservation_amount_clp: existingReservation.lot?.reservation_amount_clp ?? 500000,
                pie: existingReservation.lot?.pie || 0,
                cuotas: existingReservation.lot?.cuotas || 0,
                valor_cuota: existingReservation.lot?.valor_cuota || 0,
                last_installment_amount: existingReservation.lot?.last_installment_amount || 0,
                price_total_clp: existingReservation.lot?.price_total_clp || 0,
                legacy_current_installment: existingReservation.installments_paid || 0,
                isPiePaid: existingReservation.pie_status !== 'PENDING',
                reserva_firmada: !!existingReservation.signed_at,
                compraventa_firmada: !!existingReservation.promesa_signed_at,
                is_promo: !!existingReservation.is_promo,
                mora_frozen: !!existingReservation.mora_frozen,
                advisor: existingReservation.advisor || "",
                observation: existingReservation.observation || "",
                extra_paid_amount: existingReservation.extra_paid_amount || 0,
                pending_amount: existingReservation.pending_amount || 0,
                has_operational_expenses: !!existingReservation.has_operational_expenses,
                next_installment_discount: existingReservation.next_installment_discount || 0,
            })
            if (existingReservation.legacy_debt_start_date) {
                setHasDebt(true)
                setDebtStartDate(new Date(existingReservation.legacy_debt_start_date))
                if (existingReservation.legacy_debt_end_date) {
                    setDebtEndDate(new Date(existingReservation.legacy_debt_end_date))
                } else {
                    setDebtEndDate(undefined)
                }
            } else {
                setHasDebt(false)
                setDebtStartDate(undefined)
                setDebtEndDate(undefined)
            }
            if (existingReservation.legacy_installment_start_date) {
                setInstallmentStartDate(new Date(existingReservation.legacy_installment_start_date))
            } else {
                setInstallmentStartDate(undefined)
            }
            if (existingReservation.next_payment_date) {
                setNextPaymentDate(new Date(existingReservation.next_payment_date))
            } else {
                setNextPaymentDate(undefined)
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
                name: "", last_name: "", email: "", phone: "", rut: "",
                marital_status: "", profession: "", nationality: "Chilena",
                address_street: "", address_number: "", address_commune: "", address_region: "",
                reservation_amount_clp: 500000, pie: 0, cuotas: 0, valor_cuota: 0, last_installment_amount: 0, price_total_clp: 0, legacy_current_installment: 0, isPiePaid: true,
                reserva_firmada: false, compraventa_firmada: false, is_promo: false, mora_frozen: false,
                advisor: "", observation: "",
                extra_paid_amount: 0, pending_amount: 0, has_operational_expenses: false,
                next_installment_discount: 0
            })
            setHasDebt(false)
            setDebtStartDate(undefined)
            setDebtEndDate(undefined)
            setInstallmentStartDate(undefined)
            setNextPaymentDate(undefined)
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
                legacy_installment_start_date: installmentStartDate?.toISOString() || null,
                next_payment_date: nextPaymentDate?.toISOString() || null,
                legacy_debt_start_date: hasDebt ? (debtStartDate?.toISOString() || null) : null,
                legacy_debt_end_date: hasDebt ? (debtEndDate?.toISOString() || null) : null,
                legacy_installment_ranges: JSON.stringify(installmentRanges.filter(r => r.from !== '' && r.to !== '' && r.amount !== '')),
                reservationId: existingReservation?.id
            })

            if (result.success) {
                toast.success(result.message)
                setFormData({
                    name: "", last_name: "", email: "", phone: "", rut: "",
                    marital_status: "", profession: "", nationality: "Chilena",
                    address_street: "", address_number: "", address_commune: "", address_region: "",
                    reservation_amount_clp: 500000, pie: 0, cuotas: 0, valor_cuota: 0, last_installment_amount: 0, price_total_clp: 0, legacy_current_installment: 0, isPiePaid: true,
                    reserva_firmada: false, compraventa_firmada: false, is_promo: false, mora_frozen: false,
                    advisor: "", observation: "",
                    extra_paid_amount: 0, pending_amount: 0, has_operational_expenses: false,
                    next_installment_discount: 0
                })
                setHasDebt(false)
                setDebtStartDate(undefined)
                setDebtEndDate(undefined)
                setInstallmentStartDate(undefined)
                setNextPaymentDate(undefined)
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

    const handleImpersonate = async () => {
        if (!existingReservation?.buyer?.id) {
            toast.error("Este cliente aún no tiene un usuario asociado. Primero debes 'Activar Workflow' o guardar los cambios.")
            return
        }

        setImpersonating(true)
        try {
            const result = await impersonateUser(existingReservation.buyer.id)
            if (result.success) {
                toast.success("Sesión de simulación activa. Redirigiendo...")
                // Open in new tab to keep the dashboard open
                window.open('/user/plots', '_blank')
            } else {
                toast.error(result.error || "Error al intentar ver como usuario")
            }
        } catch (error) {
            console.error("Impersonation error:", error)
            toast.error("Ocurrió un error al procesar la solicitud")
        } finally {
            setImpersonating(false)
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
                            <Label htmlFor="name">Nombre(s)</Label>
                            <Input
                                id="name"
                                required
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="last_name">Apellido(s)</Label>
                            <Input
                                id="last_name"
                                value={formData.last_name}
                                onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                                placeholder="Ej: Canales"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="advisor">Asesor</Label>
                            <select
                                id="advisor"
                                value={formData.advisor}
                                onChange={(e) => setFormData({ ...formData, advisor: e.target.value })}
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                            >
                                <option value="">Seleccionar Asesor</option>
                                <option value="Marcela">Marcela</option>
                                <option value="Orlando">Orlando</option>
                                <option value="Barbara">Barbara</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="observation">Observación</Label>
                            <Input
                                id="observation"
                                value={formData.observation}
                                onChange={(e) => setFormData({ ...formData, observation: e.target.value })}
                                placeholder="Ej: Cliente VIP, requiere seguimiento"
                            />
                        </div>
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

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-blue-50/30 p-3 rounded-md border border-blue-100">
                        <div className="space-y-2">
                            <Label htmlFor="extra_paid_amount" className="text-blue-900 font-semibold">Pagos Extra Realizados (CLP)</Label>
                            <Input
                                id="extra_paid_amount"
                                type="number"
                                value={formData.extra_paid_amount === 0 ? "" : formData.extra_paid_amount}
                                onChange={(e) => setFormData({ ...formData, extra_paid_amount: Number(e.target.value) })}
                                placeholder="Ej: Pago deuda offline"
                            />
                            <p className="text-[10px] text-blue-600">Suma este valor al total pagado del cliente (uso interno).</p>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="pending_amount" className="text-red-900 font-semibold">Deuda Pendiente Adicional (CLP)</Label>
                            <Input
                                id="pending_amount"
                                type="number"
                                value={formData.pending_amount === 0 ? "" : formData.pending_amount}
                                onChange={(e) => setFormData({ ...formData, pending_amount: Number(e.target.value) })}
                                placeholder="Ej: Saldo pendiente"
                            />
                            <p className="text-[10px] text-red-600">Monto EXTRA que el cliente aún debe por otros conceptos.</p>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="next_installment_discount" className="text-green-900 font-semibold">Descuento Compensatorio (CLP)</Label>
                            <Input
                                id="next_installment_discount"
                                type="number"
                                value={formData.next_installment_discount === 0 ? "" : formData.next_installment_discount}
                                onChange={(e) => setFormData({ ...formData, next_installment_discount: Number(e.target.value) })}
                                placeholder="Ej: 20000"
                            />
                            <p className="text-[10px] text-green-600">Este monto se RESTARÁ del próximo pago del cliente.</p>
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

                    <div className="flex items-center space-x-2 bg-purple-50 border border-purple-200 p-3 rounded-md">
                        <input
                            type="checkbox"
                            id="has_operational_expenses"
                            className="w-4 h-4 text-purple-600 rounded border-gray-300 focus:ring-purple-500"
                            checked={formData.has_operational_expenses}
                            onChange={(e) => setFormData({ ...formData, has_operational_expenses: e.target.checked })}
                        />
                        <div className="grid gap-1.5 leading-none">
                            <label
                                htmlFor="has_operational_expenses"
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-purple-900"
                            >
                                Cliente con Gastos Operacionales
                            </label>
                            <p className="text-[11px] text-purple-700">
                                Selecciona esta opción si el cliente contempla gastos operacionales formales.
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
                                <Label htmlFor="legacy_current_installment">Cuotas ya PAGADAS por el cliente</Label>
                                <Input
                                    id="legacy_current_installment"
                                    type="number"
                                    min="0"
                                    required
                                    value={formData.legacy_current_installment}
                                    onChange={(e) => setFormData({ ...formData, legacy_current_installment: Number(e.target.value) })}
                                />
                                <p className="text-xs text-blue-600 font-medium">Indica el número total de cuotas que el cliente ya tiene canceladas. Ej: Si pagó 2, pon 2.</p>
                            </div>

                            <div className="space-y-2">
                                <Label>Fecha Inicio de Cuotas</Label>
                                <p className="text-xs text-gray-500">Selecciona el <strong>día 5 del MES de la primera cuota</strong>. Ej: si la cuota 1 fue en Enero, selecciona 5 de Enero.</p>
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

                            <div className="space-y-2">
                                <Label className="text-blue-900 font-bold">Manual: Próximo Pago</Label>
                                <p className="text-xs text-blue-700">Opcional: Sobrescribe la fecha calculada para el siguiente pago solamente.</p>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            className={cn(
                                                "w-full justify-start text-left font-semibold border-blue-300 bg-blue-50/50 hover:bg-blue-100",
                                                !nextPaymentDate && "text-muted-foreground"
                                            )}
                                        >
                                            <CalendarIcon className="mr-2 h-4 w-4 text-blue-600" />
                                            {nextPaymentDate ? format(nextPaymentDate, "dd/MM/yyyy", { locale: es }) : <span>Automático (Día 5)</span>}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <div className="p-2 border-b border-gray-100">
                                            <Button 
                                                variant="ghost" 
                                                size="sm" 
                                                className="w-full text-xs text-red-500 hover:text-red-700 h-7"
                                                onClick={() => setNextPaymentDate(undefined)}
                                            >
                                                Limpiar / Volver a Automático
                                            </Button>
                                        </div>
                                        <Calendar
                                            mode="single"
                                            selected={nextPaymentDate}
                                            onSelect={setNextPaymentDate}
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
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                                    <div className="space-y-1">
                                        <Label className="block mb-2 text-[10px] font-bold uppercase text-blue-900">Fecha INICIO mora</Label>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    type="button"
                                                    variant={"outline"}
                                                    className={cn(
                                                        "w-full justify-start text-left font-normal border-blue-200",
                                                        !debtStartDate && "text-muted-foreground"
                                                    )}
                                                >
                                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                                    {debtStartDate ? format(debtStartDate, "dd/MM/yyyy", { locale: es }) : <span>Seleccionar Inicio</span>}
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
                                    <div className="space-y-1">
                                        <Label className="block mb-2 text-[10px] font-bold uppercase text-blue-900">Fecha FIN mora (Opcional)</Label>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    type="button"
                                                    variant={"outline"}
                                                    className={cn(
                                                        "w-full justify-start text-left font-normal border-blue-200",
                                                        !debtEndDate && "text-muted-foreground"
                                                    )}
                                                >
                                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                                    {debtEndDate ? format(debtEndDate, "dd/MM/yyyy", { locale: es }) : <span>Hasta hoy (Dinámico)</span>}
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0" align="start">
                                                <div className="p-2 border-b border-gray-100">
                                                    <Button 
                                                        variant="ghost" 
                                                        size="sm" 
                                                        className="w-full text-xs text-red-500 hover:text-red-700 h-7"
                                                        onClick={() => setDebtEndDate(undefined)}
                                                    >
                                                        Limpiar / Hasta hoy
                                                    </Button>
                                                </div>
                                                <Calendar
                                                    mode="single"
                                                    selected={debtEndDate}
                                                    onSelect={setDebtEndDate}
                                                    initialFocus
                                                />
                                            </PopoverContent>
                                        </Popover>
                                        <p className="text-[9px] text-blue-600 mt-1">Si se deja vacío, la mora se calcula hasta el día de hoy.</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="bg-amber-50/50 p-4 rounded-lg border border-amber-100 space-y-4">
                        <h4 className="font-semibold text-amber-900 border-b border-amber-200 pb-2">Seguimiento Interno</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="advisor">Asesor a cargo</Label>
                                <select
                                    id="advisor"
                                    value={formData.advisor}
                                    onChange={(e) => setFormData({ ...formData, advisor: e.target.value })}
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    <option value="">Seleccione un asesor...</option>
                                    <option value="Marcela">Marcela</option>
                                    <option value="Orlando">Orlando</option>
                                    <option value="Barbara">Barbara</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="observation">Observación Interna</Label>
                                <textarea
                                    id="observation"
                                    value={formData.observation}
                                    onChange={(e) => setFormData({ ...formData, observation: e.target.value })}
                                    placeholder="Nota interna sobre el cliente..."
                                    className="flex min-h-[40px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                />
                            </div>
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

                    <div className="flex justify-between items-center pt-4 border-t mt-4">
                        <div>
                            {existingReservation?.buyer?.id && (
                                <Button 
                                    type="button" 
                                    variant="outline" 
                                    className="border-amber-500 text-amber-700 hover:bg-amber-50 hover:text-amber-800"
                                    onClick={handleImpersonate}
                                    disabled={loading || impersonating}
                                >
                                    {impersonating ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
                                    Ver como usuario
                                </Button>
                            )}
                        </div>
                        <div className="flex gap-2">
                            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                                Cancelar
                            </Button>
                            <Button type="submit" className="bg-[#36595F] text-white hover:bg-[#2A464B]" disabled={loading}>
                                {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                                {existingReservation ? "Guardar Cambios" : "Asignar Dueño"}
                            </Button>
                        </div>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
