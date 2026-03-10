'use client'

import { useState, useEffect } from "react"
import { Check, ChevronsUpDown, Search, CalendarIcon, X } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { useRouter, useParams } from "next/navigation"
import { Calendar } from "@/components/ui/calendar"

interface UserNavigatorProps {
    users: {
        id: string
        name: string
        email: string
        createdAt: Date
    }[]
}

export function UserNavigator({ users }: UserNavigatorProps) {
    const [open, setOpen] = useState(false)
    const [value, setValue] = useState("")
    const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({ from: undefined, to: undefined })
    const router = useRouter()
    const params = useParams()

    // Set initial value based on URL
    useEffect(() => {
        if (params?.userId) {
            setValue(params.userId as string)
        }
    }, [params?.userId])

    // Filter users based on date range
    const filteredUsers = users.filter((user) => {
        if (!dateRange.from && !dateRange.to) return true

        const userDate = new Date(user.createdAt)
        userDate.setHours(0, 0, 0, 0) // Normalize time

        if (dateRange.from && dateRange.to) {
            const start = new Date(dateRange.from)
            start.setHours(0, 0, 0, 0)
            const end = new Date(dateRange.to)
            end.setHours(23, 59, 59, 999)
            return userDate >= start && userDate <= end
        }

        if (dateRange.from) {
            const start = new Date(dateRange.from)
            start.setHours(0, 0, 0, 0)
            return userDate >= start
        }

        return true
    })

    const selectedUser = users.find((user) => user.id === value)

    return (
        <div className="w-full max-w-[450px]">
            <label className="text-xs text-gray-400 mb-1.5 block font-medium uppercase tracking-wider">
                Ver gestión de otro usuario
            </label>
            <div className="flex gap-2">
                <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className="w-full justify-between bg-white/5 border-white/10 text-white hover:bg-white/10 hover:text-white"
                    >
                        {selectedUser ? (
                            <span className="truncate">{selectedUser.name} ({selectedUser.email})</span>
                        ) : (
                            "Buscar usuario..."
                        )}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[300px] p-0 bg-gray-900 border-white/10 text-white">
                <Command className="bg-transparent text-white">
                    <CommandInput placeholder="Buscar por nombre o email..." className="text-white" />
                    <CommandList>
                        <CommandEmpty>No se encontraron usuarios.</CommandEmpty>
                        <CommandGroup className="text-white">
                            <CommandItem
                                value="all todos los usuarios"
                                onSelect={() => {
                                    setValue("all")
                                    setOpen(false)
                                    router.push(`/admin/users/all/plots`)
                                }}
                                className="text-white hover:bg-white/10 aria-selected:bg-white/10 font-bold border-b border-white/10"
                            >
                                <Check
                                    className={cn(
                                        "mr-2 h-4 w-4",
                                        value === "all" ? "opacity-100" : "opacity-0"
                                    )}
                                />
                                <span>Todos los usuarios</span>
                            </CommandItem>
                            {filteredUsers.map((user) => (
                                <CommandItem
                                    key={user.id}
                                    value={`${user.name} ${user.email} ${format(new Date(user.createdAt), "dd/MM/yyyy")}`}
                                    onSelect={() => {
                                        setValue(user.id)
                                        setOpen(false)
                                        router.push(`/admin/users/${user.id}/plots`)
                                    }}
                                    className="text-white hover:bg-white/10 aria-selected:bg-white/10"
                                >
                                    <Check
                                        className={cn(
                                            "mr-2 h-4 w-4",
                                            value === user.id ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                    <div className="flex flex-col">
                                        <span>{user.name}</span>
                                        <div className="flex items-center gap-2">
                                            <span className="text-[10px] text-gray-400">{user.email}</span>
                                            <span className="text-[10px] text-gray-500 bg-black/20 px-1 py-0.5 rounded">
                                                {format(new Date(user.createdAt), "dd/MMM/yy", { locale: es })}
                                            </span>
                                        </div>
                                    </div>
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>

        {/* Date Range Filter */}
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    className={cn(
                        "w-auto justify-start text-left font-normal bg-white/5 border-white/10 hover:bg-white/10 shrink-0",
                        !dateRange.from && "text-gray-400",
                        dateRange.from && "border-[#36595F] text-[#36595F] bg-[#36595F]/10 hover:bg-[#36595F]/20 font-bold"
                    )}
                >
                    <CalendarIcon className="h-4 w-4 sm:mr-2" />
                    <span className="hidden sm:inline">
                        {dateRange?.from ? (
                            dateRange.to ? (
                                <>
                                    {format(dateRange.from, "dd LLL y", { locale: es })} -{" "}
                                    {format(dateRange.to, "dd LLL y", { locale: es })}
                                </>
                            ) : (
                                format(dateRange.from, "dd LLL y", { locale: es })
                            )
                        ) : (
                            "Filtrar Fecha"
                        )}
                    </span>
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 bg-white" align="end">
                <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={dateRange?.from}
                    selected={dateRange}
                    onSelect={(range) => setDateRange({ from: range?.from, to: range?.to })}
                    numberOfMonths={1}
                />
                <div className="p-3 border-t flex justify-end">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setDateRange({ from: undefined, to: undefined })}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        Limpiar Filtro
                    </Button>
                </div>
            </PopoverContent>
        </Popover>
    </div>
        </div>
    )
}
