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
            <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>
                        {step === "success" ? "¡Firma Exitosa!" : `Firma Electrónica - Lote ${lotNumber}`}
                    </DialogTitle>
                    <DialogDescription>
                        {step === "success"
                            ? "El contrato ha sido firmado correctamente."
                            : `Revisa el contrato y firma digitalmente. Lote ${lotNumber} (Etapa ${lotStage}).`
                        }
                    </DialogDescription>
                </DialogHeader>

                <div className="py-2 space-y-4">
                    {/* Contract Preview (only if not success) */}
                    {step !== "success" && (
                        <div className="w-full h-[50vh] border rounded-md overflow-hidden bg-gray-100">
                            <iframe
                                src={`/api/contracts/${reservationId}/pdf`}
                                className="w-full h-full"
                                title="Contrato de Reserva"
                            />
                        </div>
                    )}

                    {step === "initial" && (
                        <div className="flex flex-col items-center justify-center space-y-4 py-4 bg-muted/20 rounded-lg p-4">
                            <div className="flex items-center gap-3">
                                <Mail className="h-6 w-6 text-[#36595F]" />
                                <span className="text-sm font-medium">Paso 1: Solicitar Código de Seguridad</span>
                            </div>
                            <p className="text-center text-xs text-muted-foreground max-w-sm">
                                Al hacer clic en "Enviar Código", recibirás un PIN de 4 dígitos en tu correo para validar tu firma.
                            </p>
                        </div>
                    )}

                    {step === "otp" && (
                        <div className="flex flex-col space-y-4 bg-muted/20 rounded-lg p-4">
                            <div className="space-y-2 text-center">
                                <label className="text-sm font-medium">Ingresa el código de 4 dígitos para firmar</label>
                                <div className="flex justify-center">
                                    <Input
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
                                        placeholder="0000"
                                        maxLength={4}
                                        className="text-center text-3xl tracking-[1em] w-48 font-mono h-12 uppercase"
                                        autoFocus
                                    />
                                </div>
                            </div>
                            <p className="text-xs text-muted-foreground text-center">
                                Revisa tu bandeja de entrada y spam.
                            </p>
                            <Button
                                variant="link"
                                size="sm"
                                onClick={handleRequestOtp}
                                disabled={loading}
                                className="text-[#36595F] text-xs h-auto p-0 mx-auto block"
                            >
                                ¿No recibiste el código? Reenviar
                            </Button>
                        </div>
                    )}

                    {step === "success" && (
                        <div className="flex flex-col items-center justify-center space-y-6 py-8">
                            <div className="rounded-full bg-green-100 p-4 mb-2 animate-in zoom-in duration-300">
                                <CheckCircle className="h-16 w-16 text-green-600" />
                            </div>
                            <div className="space-y-2 text-center max-w-md">
                                <p className="text-xl font-bold text-[#36595F]">
                                    Gracias por preferirnos
                                </p>
                                <p className="text-muted-foreground text-lg">
                                    En las próximas 48 horas nuestro equipo se estará comunicando contigo.
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                <DialogFooter className="sm:justify-end gap-2">
                    {step === "initial" && (
                        <Button onClick={handleRequestOtp} disabled={loading} className="w-full sm:w-auto bg-[#36595F] hover:bg-[#2b464a]">
                            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Mail className="mr-2 h-4 w-4" />}
                            Enviar Código y Firmar
                        </Button>
                    )}

                    {step === "otp" && (
                        <Button onClick={handleVerifyOtp} disabled={loading} className="w-full sm:w-auto bg-[#36595F] hover:bg-[#2b464a]">
                            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle className="mr-2 h-4 w-4" />}
                            Confirmar Firma
                        </Button>
                    )}

                    {step === "success" && (
                        <Button onClick={handleClose} className="w-full sm:w-auto bg-[#36595F] hover:bg-[#2b464a]">
                            Entendido
                        </Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
