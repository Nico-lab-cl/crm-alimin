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
    const [step, setStep] = useState<"initial" | "otp">("initial");
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
            setIsOpen(false);
            if (onSuccess) onSuccess();
            router.refresh();
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="w-full border-[#36595F] text-[#36595F] hover:bg-[#36595F]/10">
                    Firmar Contrato Digital
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Firma Electrónica - Lote {lotNumber}</DialogTitle>
                    <DialogDescription>
                        Para firmar el contrato del Lote {lotNumber} (Etapa {lotStage}), enviaremos un código de seguridad a tu correo electrónico registrado.
                    </DialogDescription>
                </DialogHeader>

                <div className="py-4">
                    {step === "initial" ? (
                        <div className="flex flex-col items-center justify-center space-y-4 py-4">
                            <Mail className="h-12 w-12 text-[#36595F]/50" />
                            <p className="text-center text-sm text-muted-foreground">
                                Al hacer clic en "Enviar Código", recibirás un correo con un PIN de 4 dígitos válido por 10 minutos.
                            </p>
                        </div>
                    ) : (
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
                </div>

                <DialogFooter className="sm:justify-end">
                    {step === "initial" ? (
                        <Button onClick={handleRequestOtp} disabled={loading} className="w-full bg-[#36595F] hover:bg-[#2b464a]">
                            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Mail className="mr-2 h-4 w-4" />}
                            Enviar Código
                        </Button>
                    ) : (
                        <Button onClick={handleVerifyOtp} disabled={loading} className="w-full bg-[#36595F] hover:bg-[#2b464a]">
                            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle className="mr-2 h-4 w-4" />}
                            Firmar Contrato
                        </Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
