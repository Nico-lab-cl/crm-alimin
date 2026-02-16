"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Loader2, Mail, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface SignContractModalProps {
    reservationId: string;
    lotNumber: string;
    lotStage: number;
    onSuccess?: () => void;
}

export function SignContractModal({ reservationId, lotNumber, lotStage, onSuccess }: SignContractModalProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [step, setStep] = useState<"initial" | "otp" | "success">("initial");
    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleRequestOtp = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/contracts/${reservationId}/sign-request`, {
                method: "POST",
            });
            const data = await res.json();

            if (!res.ok) throw new Error(data.error || "Error al solicitar código");

            toast.success("Código enviado a tu correo");
            setStep("otp");
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async () => {
        if (otp.length !== 4) {
            toast.error("El código debe tener 4 dígitos");
            return;
        }

        setLoading(true);
        try {
            const res = await fetch(`/api/contracts/${reservationId}/sign-verify`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ code: otp }),
            });
            const data = await res.json();

            if (!res.ok) throw new Error(data.error || "Error al verificar código");

            toast.success("Contrato firmado exitosamente");
            setStep("success");
            // Perform updates in background, but keep modal open
            if (onSuccess) onSuccess();
            router.refresh();
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setIsOpen(false);
        // Reset state after closing animation
        setTimeout(() => {
            setStep("initial");
            setOtp("");
        }, 300);
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => {
            if (!open) handleClose();
            else setIsOpen(true);
        }}>
            <DialogTrigger asChild>
                <Button variant="outline" className="w-full border-[#36595F] text-[#36595F] hover:bg-[#36595F]/10">
                    Firmar Contrato Digital
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>
                        {step === "success" ? "¡Firma Exitosa!" : `Firma Electrónica - Lote ${lotNumber}`}
                    </DialogTitle>
                    <DialogDescription>
                        {step === "success"
                            ? "El contrato ha sido firmado correctamente."
                            : `Para firmar el contrato del Lote ${lotNumber} (Etapa ${lotStage}), enviaremos un código de seguridad a tu correo electrónico registrado.`
                        }
                    </DialogDescription>
                </DialogHeader>

                <div className="py-4">
                    {step === "initial" && (
                        <div className="flex flex-col items-center justify-center space-y-4 py-4">
                            <Mail className="h-12 w-12 text-[#36595F]/50" />
                            <p className="text-center text-sm text-muted-foreground">
                                Al hacer clic en "Enviar Código", recibirás un correo con un PIN de 4 dígitos válido por 10 minutos.
                            </p>
                        </div>
                    )}

                    {step === "otp" && (
                        <div className="flex flex-col space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Ingresa el código de 4 dígitos</label>
                                <Input
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    placeholder="0000"
                                    maxLength={4}
                                    className="text-center text-2xl tracking-widest"
                                />
                            </div>
                            <p className="text-xs text-muted-foreground text-center">
                                Revisa tu bandeja de entrada y spam.
                            </p>
                            <Button
                                variant="link"
                                size="sm"
                                onClick={handleRequestOtp}
                                disabled={loading}
                                className="text-[#36595F] text-xs h-auto p-0"
                            >
                                ¿No recibiste el código? Reenviar
                            </Button>
                        </div>
                    )}

                    {step === "success" && (
                        <div className="flex flex-col items-center justify-center space-y-6 py-2">
                            <div className="rounded-full bg-green-100 p-3 mb-2 animate-in zoom-in duration-300">
                                <CheckCircle className="h-12 w-12 text-green-600" />
                            </div>
                            <div className="space-y-2 text-center">
                                <p className="text-lg font-medium text-[#36595F]">
                                    Gracias por preferirnos
                                </p>
                                <p className="text-muted-foreground">
                                    En las próximas 48 horas nuestro equipo se estará comunicando contigo.
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                <DialogFooter className="sm:justify-end">
                    {step === "initial" && (
                        <Button onClick={handleRequestOtp} disabled={loading} className="w-full bg-[#36595F] hover:bg-[#2b464a]">
                            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Mail className="mr-2 h-4 w-4" />}
                            Enviar Código
                        </Button>
                    )}

                    {step === "otp" && (
                        <Button onClick={handleVerifyOtp} disabled={loading} className="w-full bg-[#36595F] hover:bg-[#2b464a]">
                            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle className="mr-2 h-4 w-4" />}
                            Firmar Contrato
                        </Button>
                    )}

                    {step === "success" && (
                        <Button onClick={handleClose} className="w-full bg-[#36595F] hover:bg-[#2b464a]">
                            Entendido
                        </Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
