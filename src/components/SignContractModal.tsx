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
                <Button className="w-full bg-[#36595F] hover:bg-[#2A464B] text-white shadow-lg hover:shadow-[#36595F]/20 transition-all animate-pulse hover:animate-none font-bold text-lg ring-2 ring-[#36595F]/50 ring-offset-2 ring-offset-black/20">
                    Firmar Contrato de Reserva
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
                            : step === "initial"
                                ? "Lee atentamente el contrato antes de proceder a la firma."
                                : "Ingresa el código enviado a tu correo para finalizar la firma."
                        }
                    </DialogDescription>
                </DialogHeader>

                <div className="py-2 space-y-4">
                    {/* Contract Preview (Always visible in initial step, hidden in OTP/Success to focus user?) 
                        User asked: "se visualice el contrato se pueda leer y AL FINAL salga un boton de firmar"
                        Let's keep it visible in initial step.
                    */}
                    {step === "initial" && (
                        <div className="w-full h-[60vh] border rounded-md overflow-hidden bg-gray-100 mb-4">
                            <iframe
                                src={`/api/contracts/${reservationId}/pdf#toolbar=0&navpanes=0&scrollbar=0`}
                                className="w-full h-full"
                                title="Contrato de Reserva"
                            />
                        </div>
                    )}

                    {step === "initial" && (
                        <div className="flex flex-col items-center justify-center space-y-2 py-2">
                            <p className="text-sm text-muted-foreground text-center">
                                Al presionar "Firmar", recibirás un código de seguridad en tu correo.
                            </p>
                        </div>
                    )}

                    {step === "otp" && (
                        <div className="flex flex-col space-y-4 bg-muted/20 rounded-lg p-6 animate-in fade-in slide-in-from-bottom-4">
                            <div className="flex items-center justify-center mb-2">
                                <Mail className="h-8 w-8 text-[#36595F]" />
                            </div>
                            <div className="space-y-2 text-center">
                                <h4 className="font-semibold text-[#36595F]">Código enviado correctamente</h4>
                                <label className="text-sm text-muted-foreground">Ingresa el código de 4 dígitos para validar tu firma</label>
                                <div className="flex justify-center mt-2">
                                    <Input
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
                                        placeholder="0000"
                                        maxLength={4}
                                        className="text-center text-3xl tracking-[1em] w-48 font-mono h-14 uppercase border-2 focus-visible:ring-[#36595F]"
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
                        <Button onClick={handleRequestOtp} disabled={loading} className="w-full bg-[#36595F] hover:bg-[#2b464a] text-lg py-6 shadow-md">
                            {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : null}
                            Firmar Contrato
                        </Button>
                    )}

                    {step === "otp" && (
                        <div className="flex flex-col sm:flex-row gap-2 w-full sm:justify-between">
                            <Button variant="ghost" onClick={() => setStep("initial")} className="text-muted-foreground">
                                Volver al Contrato
                            </Button>
                            <Button onClick={handleVerifyOtp} disabled={loading} className="w-full sm:w-auto bg-[#36595F] hover:bg-[#2b464a]">
                                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle className="mr-2 h-4 w-4" />}
                                Confirmar Firma
                            </Button>
                        </div>
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
