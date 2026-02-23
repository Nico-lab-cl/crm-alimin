export function getEffectiveStage(r: any): string {
    let stage = r.pipeline_stage || "RESERVA_PAGADA"

    // Legacy DB mappings to new UI Columns
    if (stage === "CONTRATO_FIRMADO") return "PIE_POR_PAGAR"
    if (stage === "CONTRATO_RESERVA") return "RESERVA_POR_FIRMAR"
    if (stage === "ESPERANDO_PIE") return "PIE_POR_PAGAR"
    if (stage === "PIE_PAGADO") return "PIE_POR_PAGAR"

    // Optional hard-enforcement based on Digital Signature
    if (r.signed_at && (stage === "RESERVA_PAGADA" || stage === "RESERVA_POR_FIRMAR")) {
        return "PIE_POR_PAGAR"
    }

    return stage
}
