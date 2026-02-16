'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createVerifiedUser } from '@/actions/dashboard'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, Loader2, Plus, UserCheck, FileSignature, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
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

export const AdminUserList = ({ users: initialUsers }: AdminUserListProps) => {
    const [users, setUsers] = useState(initialUsers)
    const [filter, setFilter] = useState('')
    const [isCreateOpen, setIsCreateOpen] = useState(false)
    const [isCreating, setIsCreating] = useState(false)
    const router = useRouter()

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

    return (
        <div className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white/5 p-4 rounded-xl border border-white/10">
                <div className="flex items-center gap-2 w-full md:w-auto">
                    <Search className="w-5 h-5 text-gray-400" />
                    <Input
                        placeholder="Buscar usuario..."
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="bg-transparent border-none text-white focus-visible:ring-0 placeholder:text-gray-500 w-full"
                    />
                </div>

                <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-[#E0B457] text-[#36595F] hover:bg-[#d4aa52] font-bold">
                            <Plus className="w-4 h-4 mr-2" />
                            Crear Usuario
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-white text-gray-900 border-none">
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

            <div className="bg-white/5 rounded-xl border border-white/10 overflow-hidden">
                <table className="w-full text-left text-sm text-gray-400">
                    <thead className="bg-white/10 text-gray-200 uppercase font-bold text-xs">
                        <tr>
                            <th className="p-4">Usuario</th>
                            <th className="p-4">Rol</th>
                            <th className="p-4">Estado Contrato</th>
                            <th className="p-4">Fecha Registro</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {filteredUsers.map(user => {
                            const hasSignedContract = user.purchases && user.purchases.length > 0;

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
                                        {hasSignedContract ? (
                                            <div className="flex items-center gap-2 text-green-400 font-bold bg-green-900/20 px-3 py-1.5 rounded-full w-fit">
                                                <FileSignature className="w-4 h-4" />
                                                <span>Con Reserva</span>
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-2 text-gray-500">
                                                <AlertCircle className="w-4 h-4" />
                                                <span>Sin Contratos</span>
                                            </div>
                                        )}
                                    </td>
                                    <td className="p-4">
                                        {new Date(user.createdAt).toLocaleDateString()}
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
        </div>
    )
}
