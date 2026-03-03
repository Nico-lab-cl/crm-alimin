'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createVerifiedUser, adminResetUserPassword } from '@/actions/dashboard'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, Loader2, Plus, FileSignature, AlertCircle, CheckCircle2, Clock, FileDown, CreditCard, ExternalLink, Lock, ChevronLeft, ChevronRight } from 'lucide-react'
import { toast } from 'sonner'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogDescription,
    DialogFooter
} from "@/components/ui/dialog"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Label } from '@/components/ui/label'

type AdminUserListProps = {
    users: any[]
}

const STAGE_LABELS: Record<string, string> = {
    RESERVA_PAGADA: 'Reserva',
    CONTRATO_FIRMADO: 'Contrato Firmado',
    ESPERANDO_PIE: 'Contrato Firmado',
    PIE_PAGADO: 'Pie Pagado',
    PIE_POR_PAGAR: 'Pie por Pagar',
    PAGO_CUOTAS: 'Pago de Cuotas',
    CUOTAS_POR_PAGAR: 'Cuotas por Pagar',
    VENTA_CERRADA: 'Venta Cerrada',
    VENTA_PERDIDA: 'Venta Perdida',
}

const STAGE_COLORS: Record<string, string> = {
    RESERVA_PAGADA: 'bg-blue-900/30 text-blue-300',
    CONTRATO_FIRMADO: 'bg-amber-900/30 text-amber-300',
    ESPERANDO_PIE: 'bg-amber-900/30 text-amber-300',
    PIE_PAGADO: 'bg-purple-900/30 text-purple-300',
    PIE_POR_PAGAR: 'bg-orange-900/30 text-orange-300',
    PAGO_CUOTAS: 'bg-indigo-900/30 text-indigo-300',
    CUOTAS_POR_PAGAR: 'bg-cyan-900/30 text-cyan-300',
    VENTA_CERRADA: 'bg-green-900/30 text-green-300',
    VENTA_PERDIDA: 'bg-red-900/30 text-red-300',
}

const USERS_PER_PAGE = 10;

export const AdminUserList = ({ users: initialUsers }: AdminUserListProps) => {
    const [users, setUsers] = useState(initialUsers)
    const [filter, setFilter] = useState('')
    const [isCreateOpen, setIsCreateOpen] = useState(false)
    const [isCreating, setIsCreating] = useState(false)
    const router = useRouter()

    // Pagination
    const [currentPage, setCurrentPage] = useState(1)

    // Reset Password State
    const [isResetOpen, setIsResetOpen] = useState(false)
    const [resetUser, setResetUser] = useState<{ id: string, name: string } | null>(null)
    const [newPassword, setNewPassword] = useState('')
    const [isResetting, setIsResetting] = useState(false)

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'USER'
    })

    const filteredUsers = users.filter(user =>
        user.name?.toLowerCase().includes(filter.toLowerCase()) ||
        user.email?.toLowerCase().includes(filter.toLowerCase())
    )

    // Pagination calculations
    const totalPages = Math.ceil(filteredUsers.length / USERS_PER_PAGE)
    const paginatedUsers = filteredUsers.slice((currentPage - 1) * USERS_PER_PAGE, currentPage * USERS_PER_PAGE)

    // Reset page when filter changes
    const handleFilterChange = (value: string) => {
        setFilter(value)
        setCurrentPage(1)
    }

    const handleCreateUser = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsCreating(true)

        const res = await createVerifiedUser(formData)

        if (res.success) {
            toast.success("Usuario creado exitosamente")
            setIsCreateOpen(false)
            setFormData({ name: '', email: '', password: '', role: 'USER' })
            router.refresh()
        } else {
            toast.error(res.error || "Error al crear usuario")
        }
        setIsCreating(false)
    }

    const openResetPassword = (user: { id: string, name: string }) => {
        setResetUser(user)
        setNewPassword('')
        setIsResetOpen(true)
    }

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!resetUser || !newPassword) return

        setIsResetting(true)
        const res = await adminResetUserPassword(resetUser.id, newPassword)

        if (res.success) {
            toast.success(`Contraseña de ${resetUser.name} actualizada`)
            setIsResetOpen(false)
            setResetUser(null)
            setNewPassword('')
        } else {
            toast.error(res.error || "Error al actualizar contraseña")
        }
        setIsResetting(false)
    }

    return (
        <div className="space-y-4 overflow-x-hidden max-w-full">
            <div className="flex flex-col gap-3 md:flex-row md:gap-4 justify-between items-stretch md:items-center bg-white/5 p-3 md:p-4 rounded-xl border border-white/10">
                <div className="flex items-center gap-2 w-full md:w-auto min-w-0">
                    <Search className="w-5 h-5 text-gray-400 shrink-0" />
                    <Input
                        placeholder="Buscar usuario..."
                        value={filter}
                        onChange={(e) => handleFilterChange(e.target.value)}
                        className="bg-transparent border-none text-white focus-visible:ring-0 placeholder:text-gray-500 w-full min-w-0"
                    />
                </div>

                <div className="flex gap-2 w-full md:w-auto">
                    {/* Reset Password Dialog */}
                    <Dialog open={isResetOpen} onOpenChange={setIsResetOpen}>
                        <DialogContent className="bg-white text-gray-900 border-none max-w-[90vw] md:max-w-md">
                            <DialogHeader>
                                <DialogTitle className="text-[#36595F] text-xl font-bold">
                                    Restablecer Contraseña
                                </DialogTitle>
                                <DialogDescription>
                                    Asigna una nueva contraseña para <b>{resetUser?.name}</b>.
                                    <br />
                                    <span className="text-amber-600 text-xs mt-1 block">
                                        El usuario deberá cambiarla en su próximo inicio de sesión.
                                    </span>
                                </DialogDescription>
                            </DialogHeader>
                            <form onSubmit={handleResetPassword} className="space-y-4 mt-2">
                                <div className="space-y-2">
                                    <Label htmlFor="new-password">Nueva Contraseña</Label>
                                    <Input
                                        id="new-password"
                                        type="text"
                                        placeholder="Ej: Lomas2025"
                                        required
                                        minLength={6}
                                        value={newPassword}
                                        onChange={e => setNewPassword(e.target.value)}
                                        className="font-mono"
                                    />
                                </div>
                                <DialogFooter>
                                    <Button type="button" variant="ghost" onClick={() => setIsResetOpen(false)}>
                                        Cancelar
                                    </Button>
                                    <Button type="submit" disabled={isResetting} className="bg-red-600 hover:bg-red-700 text-white">
                                        {isResetting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Cambiar Contraseña'}
                                    </Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>

                    {/* Create User Dialog */}
                    <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                        <DialogTrigger asChild>
                            <Button className="bg-[#E0B457] text-[#36595F] hover:bg-[#d4aa52] font-bold w-full md:w-auto min-h-[44px]">
                                <Plus className="w-4 h-4 mr-2" />
                                Crear Usuario
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-white text-gray-900 border-none max-w-[90vw] md:max-w-md">
                            <DialogHeader>
                                <DialogTitle className="text-[#36595F] text-2xl font-bold">Crear Usuario Verificado</DialogTitle>
                            </DialogHeader>
                            <form onSubmit={handleCreateUser} className="space-y-4 mt-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Nombre Completo</Label>
                                    <Input
                                        id="name"
                                        required
                                        value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email">Correo Electrónico</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        required
                                        value={formData.email}
                                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="password">Contraseña</Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        required
                                        minLength={6}
                                        value={formData.password}
                                        onChange={e => setFormData({ ...formData, password: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="role">Rol</Label>
                                    <Select
                                        value={formData.role}
                                        onValueChange={val => setFormData({ ...formData, role: val })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="USER">Usuario (Comprador)</SelectItem>
                                            <SelectItem value="SELLER">Vendedor</SelectItem>
                                            <SelectItem value="ADMIN">Administrador</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="flex justify-end gap-3 pt-4">
                                    <Button type="button" variant="ghost" onClick={() => setIsCreateOpen(false)}>
                                        Cancelar
                                    </Button>
                                    <Button type="submit" disabled={isCreating} className="bg-[#36595F] hover:bg-[#2A464B] text-white">
                                        {isCreating ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Crear Usuario'}
                                    </Button>
                                </div>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            {/* ===== DESKTOP TABLE (md+) ===== */}
            <div className="hidden md:block bg-white/5 rounded-xl border border-white/10 overflow-hidden">
                <table className="w-full text-left text-sm text-gray-400">
                    <thead className="bg-white/10 text-gray-200 uppercase font-bold text-xs">
                        <tr>
                            <th className="p-4">Usuario</th>
                            <th className="p-4">Rol</th>
                            <th className="p-4">Terreno</th>
                            <th className="p-4">Estado Contrato</th>
                            <th className="p-4">Fecha Registro</th>
                            <th className="p-4">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {filteredUsers.map(user => {
                            const res = user.purchases?.[0] ?? null

                            return (
                                <tr key={user.id} className="hover:bg-white/5 transition-colors">
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-[#36595F] flex items-center justify-center text-[#E0B457] font-bold text-lg">
                                                {user.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="font-bold text-white text-base">{user.name}</p>
                                                <p className="text-gray-500">{user.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded text-xs font-bold ${user.role === 'ADMIN' ? 'bg-purple-500/20 text-purple-400' :
                                            user.role === 'SELLER' ? 'bg-blue-500/20 text-blue-400' :
                                                'bg-gray-500/20 text-gray-400'
                                            }`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        {res?.lot ? (
                                            <span className="text-white font-medium text-sm">
                                                Terreno {res.lot.number} – Etapa {res.lot.stage}
                                            </span>
                                        ) : (
                                            <span className="text-gray-600 text-xs">Sin terreno</span>
                                        )}
                                    </td>
                                    <td className="p-4">
                                        {res ? (
                                            <div className="flex flex-col gap-1.5">
                                                <span className={`px-2 py-1 rounded-full text-xs font-bold w-fit ${STAGE_COLORS[res.pipeline_stage] ?? 'bg-gray-700 text-gray-300'}`}>
                                                    {STAGE_LABELS[res.pipeline_stage] ?? res.pipeline_stage}
                                                </span>
                                                {res.signed_at ? (
                                                    <div className="flex items-center gap-1.5">
                                                        <CheckCircle2 className="w-3.5 h-3.5 text-green-400" />
                                                        <span className="text-green-400 text-xs font-medium">Contrato firmado</span>
                                                        <a
                                                            href={`/api/contracts/${res.id}/pdf`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="ml-1 text-[#E0B457] hover:underline text-xs flex items-center gap-0.5"
                                                        >
                                                            <FileDown className="w-3 h-3" /> PDF
                                                        </a>
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center gap-1.5">
                                                        <Clock className="w-3.5 h-3.5 text-gray-500" />
                                                        <span className="text-gray-500 text-xs">Sin firma</span>
                                                        <a
                                                            href={`/api/contracts/${res.id}/pdf`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="ml-1 text-gray-400 hover:text-gray-300 hover:underline text-xs flex items-center gap-0.5"
                                                            title="Ver contrato pendiente"
                                                        >
                                                            <FileDown className="w-3 h-3" /> PDF
                                                        </a>
                                                    </div>
                                                )}
                                                {res.pie_status === 'PAID' && (
                                                    <div className="flex items-center gap-1.5">
                                                        <CheckCircle2 className="w-3.5 h-3.5 text-purple-400" />
                                                        <span className="text-purple-400 text-xs">Pie pagado</span>
                                                    </div>
                                                )}
                                                {(res.installments_paid ?? 0) > 0 && (
                                                    <div className="flex items-center gap-1.5">
                                                        <CreditCard className="w-3.5 h-3.5 text-indigo-400" />
                                                        <span className="text-indigo-400 text-xs">{res.installments_paid} cuota(s) pagada(s)</span>
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-2 text-gray-600">
                                                <AlertCircle className="w-4 h-4" />
                                                <span className="text-xs">Sin reserva</span>
                                            </div>
                                        )}
                                    </td>
                                    <td className="p-4">
                                        {new Date(user.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="p-4">
                                        <div className="flex gap-2">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => openResetPassword(user)}
                                                className="text-amber-500 hover:text-amber-400 hover:bg-amber-900/20"
                                                title="Cambiar Contraseña"
                                            >
                                                <Lock className="w-4 h-4" />
                                            </Button>
                                            <Link href={`/admin/users/${user.id}/plots`}>
                                                <Button variant="ghost" size="sm" className="text-blue-400 hover:text-blue-300 hover:bg-blue-900/20">
                                                    <ExternalLink className="w-4 h-4 mr-2" />
                                                    Ver Gestión
                                                </Button>
                                            </Link>
                                        </div>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
                {filteredUsers.length === 0 && (
                    <div className="p-8 text-center text-gray-500">
                        No se encontraron usuarios.
                    </div>
                )}
            </div>

            {/* ===== MOBILE CARD LIST (<md) ===== */}
            <div className="md:hidden space-y-3">
                {filteredUsers.length === 0 ? (
                    <div className="py-16 text-center">
                        <Search className="w-10 h-10 text-gray-600 mx-auto mb-3" />
                        <p className="text-gray-500 text-sm">No se encontraron usuarios.</p>
                    </div>
                ) : (
                    <>
                        <p className="text-[11px] text-gray-500 font-medium px-1">
                            {filteredUsers.length} usuario{filteredUsers.length !== 1 ? 's' : ''}
                            {totalPages > 1 && ` · Pág ${currentPage} de ${totalPages}`}
                        </p>
                        {paginatedUsers.map(user => {
                            const res = user.purchases?.[0] ?? null
                            const roleLabel = user.role === 'ADMIN' ? 'Admin' : user.role === 'SELLER' ? 'Vendedor' : 'Cliente'

                            return (
                                <div
                                    key={user.id}
                                    className="bg-gradient-to-br from-white/[0.06] to-white/[0.02] rounded-2xl border border-white/[0.08] overflow-hidden"
                                >
                                    {/* Header: Avatar + Name + Role */}
                                    <div className="px-4 pt-4 pb-3">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#36595F] to-[#2a464b] flex items-center justify-center text-[#E0B457] font-bold text-xl shrink-0 shadow-lg ring-2 ring-white/5">
                                                {user.name?.charAt(0).toUpperCase() || '?'}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2">
                                                    <p className="font-bold text-white text-[15px] truncate">{user.name}</p>
                                                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold shrink-0 ${user.role === 'ADMIN' ? 'bg-purple-500/20 text-purple-400 ring-1 ring-purple-500/20' :
                                                        user.role === 'SELLER' ? 'bg-blue-500/20 text-blue-400 ring-1 ring-blue-500/20' :
                                                            'bg-white/10 text-gray-400 ring-1 ring-white/5'
                                                        }`}>
                                                        {roleLabel}
                                                    </span>
                                                </div>
                                                <p className="text-gray-500 text-xs truncate mt-0.5">{user.email}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Lot + Status Info */}
                                    {res ? (
                                        <div className="px-4 pb-3">
                                            {/* Lot Row */}
                                            {res.lot && (
                                                <div className="flex items-center gap-2 mb-2">
                                                    <div className="w-7 h-7 rounded-lg bg-alimin-green/20 flex items-center justify-center">
                                                        <span className="text-[10px] font-black text-alimin-gold">{res.lot.number}</span>
                                                    </div>
                                                    <div>
                                                        <p className="text-white text-xs font-semibold">Terreno {res.lot.number}</p>
                                                        <p className="text-gray-500 text-[10px]">Etapa {res.lot.stage}</p>
                                                    </div>
                                                </div>
                                            )}
                                            {/* Badges */}
                                            <div className="flex flex-wrap gap-1.5">
                                                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${STAGE_COLORS[res.pipeline_stage] ?? 'bg-gray-700 text-gray-300'}`}>
                                                    {STAGE_LABELS[res.pipeline_stage] ?? res.pipeline_stage}
                                                </span>
                                                {res.signed_at && (
                                                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-green-900/30 text-green-400 ring-1 ring-green-500/10">
                                                        ✓ Firmado
                                                    </span>
                                                )}
                                                {res.pie_status === 'PAID' && (
                                                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-purple-900/30 text-purple-400 ring-1 ring-purple-500/10">
                                                        Pie ✓
                                                    </span>
                                                )}
                                                {(res.installments_paid ?? 0) > 0 && (
                                                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-indigo-900/30 text-indigo-400 ring-1 ring-indigo-500/10">
                                                        {res.installments_paid} cuota{(res.installments_paid ?? 0) > 1 ? 's' : ''}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="px-4 pb-3">
                                            <div className="flex items-center gap-1.5 text-gray-600">
                                                <AlertCircle className="w-3.5 h-3.5" />
                                                <span className="text-xs">Sin terreno asignado</span>
                                            </div>
                                        </div>
                                    )}

                                    {/* Date */}
                                    <div className="px-4 pb-2">
                                        <p className="text-[10px] text-gray-600">
                                            Registrado {new Date(user.createdAt).toLocaleDateString('es-CL', { day: 'numeric', month: 'short', year: 'numeric' })}
                                        </p>
                                    </div>

                                    {/* Action Buttons — 48px height, full bleed */}
                                    <div className="flex border-t border-white/5">
                                        <button
                                            onClick={() => openResetPassword(user)}
                                            className="flex items-center justify-center gap-2 flex-1 min-h-[48px] text-amber-400 text-xs font-semibold hover:bg-amber-900/15 transition-colors active:scale-[0.97] active:bg-amber-900/25 border-r border-white/5"
                                        >
                                            <Lock className="w-4 h-4" />
                                            Contraseña
                                        </button>
                                        <Link href={`/admin/users/${user.id}/plots`} className="flex-1">
                                            <button className="flex items-center justify-center gap-2 w-full min-h-[48px] text-blue-400 text-xs font-semibold hover:bg-blue-900/15 transition-colors active:scale-[0.97] active:bg-blue-900/25">
                                                <ExternalLink className="w-4 h-4" />
                                                Ver Gestión
                                            </button>
                                        </Link>
                                    </div>
                                </div>
                            )
                        })}
                    </>
                )}

                {/* Pagination Controls */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-between gap-3 pt-2 pb-4">
                        <button
                            onClick={() => { setCurrentPage(p => Math.max(1, p - 1)); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                            disabled={currentPage === 1}
                            className="flex items-center justify-center gap-1 min-h-[44px] px-4 rounded-xl bg-white/5 border border-white/10 text-white text-xs font-bold disabled:opacity-30 disabled:cursor-not-allowed active:scale-[0.95] transition-all"
                        >
                            <ChevronLeft className="w-4 h-4" />
                            Anterior
                        </button>
                        <span className="text-xs text-gray-400 font-mono">
                            {currentPage}/{totalPages}
                        </span>
                        <button
                            onClick={() => { setCurrentPage(p => Math.min(totalPages, p + 1)); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                            disabled={currentPage === totalPages}
                            className="flex items-center justify-center gap-1 min-h-[44px] px-4 rounded-xl bg-white/5 border border-white/10 text-white text-xs font-bold disabled:opacity-30 disabled:cursor-not-allowed active:scale-[0.95] transition-all"
                        >
                            Siguiente
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                )}
            </div>
        </div >
    )
}
