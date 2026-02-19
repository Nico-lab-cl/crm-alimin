'use client'

import { useState, useEffect } from "react"
import { Check, ChevronsUpDown, Search } from "lucide-react"
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

interface UserNavigatorProps {
    users: {
        id: string
        name: string
        email: string
    }[]
}

export function UserNavigator({ users }: UserNavigatorProps) {
    const [open, setOpen] = useState(false)
    const [value, setValue] = useState("")
    const router = useRouter()
    const params = useParams()

    // Set initial value based on URL
    useEffect(() => {
        if (params?.userId) {
            setValue(params.userId as string)
        }
    }, [params?.userId])

    const selectedUser = users.find((user) => user.id === value)

    return (
        <div className="w-full max-w-sm">
            <label className="text-xs text-gray-400 mb-1.5 block font-medium uppercase tracking-wider">
                Ver gestión de otro usuario
            </label>
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
                                {users.map((user) => (
                                    <CommandItem
                                        key={user.id}
                                        value={`${user.name} ${user.email}`} // Search against this string
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
                                            <span className="text-xs text-gray-400">{user.email}</span>
                                        </div>
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
        </div>
    )
}
