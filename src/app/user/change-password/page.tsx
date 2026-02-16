"use client";

import { useSession, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { PasswordInput } from "@/components/ui/password-input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";
import Link from "next/link";
import { Loader2, ArrowLeft } from "lucide-react";
import Image from "next/image";

const formSchema = z.object({
    currentPassword: z.string().min(1, "La contraseña actual es requerida"),
    newPassword: z.string().min(6, "La nueva contraseña debe tener al menos 6 caracteres"),
    confirmPassword: z.string().min(6, "Confirma tu nueva contraseña"),
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
});

export default function ChangePasswordPage() {
    const { data: session, status } = useSession();
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsLoading(true);
        try {
            const response = await fetch("/api/user/change-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    currentPassword: values.currentPassword,
                    newPassword: values.newPassword,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Error al actualizar la contraseña");
            }

            toast({
                title: "Contraseña actualizada",
                description: "Tu contraseña ha sido cambiada exitosamente. Por favor inicia sesión nuevamente.",
            });

            form.reset();

            // Force sign out to clear stale session data
            // Use signOut from next-auth/react to skip the confirmation page
            // Redirect to login with a special flag
            setTimeout(async () => {
                await signOut({ callbackUrl: '/login?passwordChanged=true' });
            }, 2000);
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Error",
                description: error.message,
            });
        } finally {
            setIsLoading(false);
        }
    }

    if (status === "loading") {
        return (
            <div className="flex justify-center items-center min-h-screen bg-black/95">
                <Loader2 className="h-8 w-8 animate-spin text-[#36595F]" />
            </div>
        )
    }

    if (status === "unauthenticated") {
        return (
            <div className="flex min-h-screen items-center justify-center bg-black/95 px-4 py-12">
                <div className="absolute inset-0 bg-[url('/terreno-bg.JPG')] bg-cover bg-center opacity-20 blur-sm" />

                <Card className="z-10 w-full max-w-md border-white/10 bg-black/80 text-white backdrop-blur-md">
                    <CardHeader className="space-y-4 text-center">
                        <CardTitle className="text-2xl font-bold text-[#36595F]">Acceso Denegado</CardTitle>
                        <CardDescription className="text-gray-400">
                            Por favor inicia sesión para cambiar tu contraseña.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Link href="/login">
                            <Button className="w-full bg-[#36595F] hover:bg-[#2a454a] text-white">
                                Ir a Iniciar Sesión
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-black/95 px-4 py-12">
            <div className="absolute inset-0 bg-[url('/terreno-bg.JPG')] bg-cover bg-center opacity-20 blur-sm" />

            <Card className="z-10 w-full max-w-md border-white/10 bg-black/80 text-white backdrop-blur-md">
                <CardHeader className="space-y-4 text-center">
                    <div className="flex justify-center">
                        <div className="relative h-16 w-48">
                            <Image
                                src="/logo.png"
                                alt="Lomas del Mar"
                                fill
                                className="object-contain invert"
                                priority
                            />
                        </div>
                    </div>
                    <CardTitle className="text-2xl font-bold tracking-tight text-[#36595F]">
                        Cambiar Contraseña
                    </CardTitle>
                    <CardDescription className="text-gray-400">
                        Ingresa tu contraseña actual y la nueva contraseña.
                    </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <FormField
                                control={form.control}
                                name="currentPassword"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-white">Contraseña Actual</FormLabel>
                                        <FormControl>
                                            <PasswordInput
                                                placeholder="******"
                                                className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-[#36595F]"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="newPassword"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-white">Nueva Contraseña</FormLabel>
                                        <FormControl>
                                            <PasswordInput
                                                placeholder="******"
                                                className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-[#36595F]"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="confirmPassword"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-white">Confirmar Nueva Contraseña</FormLabel>
                                        <FormControl>
                                            <PasswordInput
                                                placeholder="******"
                                                className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-[#36595F]"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button
                                type="submit"
                                className="w-full bg-[#36595F] hover:bg-[#2a454a] text-white"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Actualizando...
                                    </>
                                ) : (
                                    "Guardar Cambios"
                                )}
                            </Button>
                        </form>
                    </Form>

                    <div className="mt-4 text-center">
                        <Link
                            href="/user/dashboard"
                            className="inline-flex items-center gap-2 text-sm text-[#36595F] hover:text-[#2a454a] hover:underline"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Volver al inicio
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
