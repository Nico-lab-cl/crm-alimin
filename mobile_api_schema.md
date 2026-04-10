# 📱 Esquemas de Datos API Móvil: Postventa Lomas del Mar

Este documento contiene las estructuras de datos, interfaces TypeScript y ejemplos de JSON sugeridos para que tu nueva API alimente la Aplicación Móvil de forma idéntica a la plataforma web.

> [!TIP]
> **Optimización Móvil:** Para evitar el consumo excesivo de datos móviles, el listado general (`GET /api/mobile/postventa/dashboard`) solo debe cargar datos agregados. Los detalles de cada lote (rangos excepcionales, fechas bases, recibos pendientes) deben cargarse bajo demanda (`GET /api/mobile/postventa/lot/{id}`).

---

## 1. Tipos Base (Interfaces TypeScript para la App Móvil)

Copia y pega estas interfaces en la carpeta `src/types` o `src/interfaces` de tu proyecto React Native, Flutter o Swift.

```typescript
// ==============================================
// 1. Tipos de Enums y Estados
// ==============================================

type LotStatus = 'available' | 'reserved' | 'sold' | 'blocked';
type PaymentScope = 'PIE' | 'INSTALLMENT' | 'OTHERS';
type ReceiptStatus = 'PENDING' | 'APPROVED' | 'REJECTED';
type MoraStatus = 'OK' | 'UPCOMING' | 'GRACE' | 'LATE';

// ==============================================
// 2. Información del Lote y Financiera (Lógica base)
// ==============================================

export interface MobileLotFinancials {
    lotId: number;
    lotNumber: string;
    stage: number;
    areaM2: number;
    
    // Configuración de Precios del Lote
    priceTotalClp: number;
    reservationAmountClp: number;
    targetPieAmountClp: number;
    
    // Configuración de Cuotas
    totalCuotas: number;
    valorCuotaNormal: number;
    valorUltimaCuota: number;
    
    // Excepciones y Legacy (Si el cliente tiene condiciones de offline)
    isLegacy: boolean;
    legacyInstallmentRanges: LegacyRange[]; // e.g. [{ from: 1, to: 10, amount: 200000 }]
    legacyDebtStartDate: string | null;  // ISO Date
    legacyInstallmentStartDate: string | null; // ISO Date
}

export interface LegacyRange {
    from: number;
    to: number;
    amount: number;
}

// ==============================================
// 3. Estado de la Cuenta del Cliente asociado al Lote
// ==============================================

export interface MobileReservationAccount {
    reservationId: string;
    clientName: string;
    clientEmail: string;
    clientPhone: string;
    
    // Progreso
    pieStatus: 'PENDING' | 'PAID';
    installmentsPaid: number;
    
    // Saldos y Totales (Calculados por el backend, no por el frontend)
    totalPaidClp: number;
    pendingBalanceClp: number;
    
    // Mora y Vencimientos (Calculados dinámicamente)
    nextDueDate: string | null; // ISO Date
    moraStatus: MoraStatus;
    lateDays: number;
    penaltyAmountClp: number;
    moraFrozen: boolean; // Si es true, la app NO debe mostrar alertas rojas.
    isPromo: boolean;
    
    // Pagos Pendientes de Aprobación
    hasPendingPieReceipt: boolean;
    hasPendingInstallmentReceipt: boolean;
}

// ==============================================
// 4. Recibos / Comprobantes de Pago
// ==============================================

export interface MobileReceipt {
    receiptId: string;
    scope: PaymentScope;
    amountClp: number;
    status: ReceiptStatus;
    rejectionReason?: string;
    installmentsCount: number;
    createdAt: string; // ISO Date
    receiptUrl: string; // URL de la imagen en S3 o ruta local
}
```

---

## 2. Endpoints y Payloads Sugeridos

### Endpoint 1: Listado General del Dashboard
**Ruta:** `GET /api/mobile/postventa/dashboard`
**Uso:** Renderizar la lista de todas las "Cards" o tarjetas en el inicio del usuario de postventa.

> [!NOTE]
> Nota que el backend ya mastica y calcula `lateDays` y `penaltyAmountClp`. El teléfono NO debe calcular intereses moratorios por sí solo para evitar discrepancias por la hora local del dispositivo.

```json
{
  "success": true,
  "stats": {
    "total": 145,
    "late": 12,
    "ok": 133
  },
  "data": [
    {
      "reservationId": "a1b2c3d4-...",
      "lotId": 14,
      "lotNumber": "L-14",
      "stage": 1,
      "clientName": "Juan Pérez",
      "installmentsPaid": 5,
      "totalCuotas": 60,
      "moraStatus": "LATE",
      "lateDays": 12,
      "penaltyAmountClp": 8500,
      "pieStatus": "PAID"
    },
    {
      "reservationId": "f9e8d7c6-...",
      "lotId": 22,
      "lotNumber": "L-22",
      "stage": 2,
      "clientName": "María González",
      "installmentsPaid": 10,
      "totalCuotas": 48,
      "moraStatus": "OK",
      "lateDays": 0,
      "penaltyAmountClp": 0,
      "pieStatus": "PENDING"
    }
  ]
}
```

### Endpoint 2: Detalle de Pago (Al abrir un lote específico)
**Ruta:** `GET /api/mobile/postventa/lot/{reservationId}`
**Uso:** Mostrar la vista completa del cliente, incluyendo botones de pago, estado exacto y listado de excepciones (Ranges) para calcular el total a pagar si el cliente decide transferir.

```json
{
  "success": true,
  "financials": {
    "lotId": 14,
    "lotNumber": "L-14",
    "stage": 1,
    "areaM2": 1000,
    "priceTotalClp": 15000000,
    "reservationAmountClp": 500000,
    "targetPieAmountClp": 1500000,
    "totalCuotas": 60,
    "valorCuotaNormal": 250000,
    "valorUltimaCuota": 250000,
    "isLegacy": false,
    "legacyInstallmentRanges": [],
    "legacyDebtStartDate": null,
    "legacyInstallmentStartDate": null
  },
  "account": {
    "reservationId": "a1b2c3d4-...",
    "clientName": "Juan Pérez",
    "clientEmail": "juan@ejemplo.com",
    "clientPhone": "+56912345678",
    "pieStatus": "PAID",
    "installmentsPaid": 5,
    "totalPaidClp": 2750000,
    "pendingBalanceClp": 12250000,
    "nextDueDate": "2026-04-05T00:00:00Z",
    "moraStatus": "LATE",
    "lateDays": 12,
    "penaltyAmountClp": 8500,
    "moraFrozen": false,
    "isPromo": false,
    "hasPendingPieReceipt": false,
    "hasPendingInstallmentReceipt": true
  },
  "recentReceipts": [
    {
      "receiptId": "rec-001",
      "scope": "INSTALLMENT",
      "amountClp": 258500, 
      "status": "PENDING",
      "installmentsCount": 1,
      "createdAt": "2026-03-30T10:00:00Z",
      "receiptUrl": "url_to_s3_or_local"
    }
  ]
}
```

### Endpoint 3: Declarar un Pago (Desde la App al Servidor)
**Ruta:** `POST /api/mobile/postventa/payments/upload`
**Uso:** Cuando el ejecutivo de postventa (o el cliente) sube una foto de una transferencia bancaria.

> [!IMPORTANT]
> **Manejo de Imágenes en Móvil:** En lugar de enviar un Base64 gigante como lo hace la web, la mejor práctica en apps móviles nativas es usar `multipart/form-data`. Esto evita bloqueos de memoria en el dispositivo y timeouts en el servidor.

**Headers:**
`Content-Type: multipart/form-data`

**Body:**
*   `reservationId`: "a1b2c3d4-..."
*   `lotId`: "14"
*   `amount`: "258500"
*   `scope`: "INSTALLMENT"
*   `installmentsCount`: "1"
*   `file`: *(Archivo Binario adjunto comprimido por la app)*

### Endpoint 4: Aprobar o Rechazar un Pago (Acción del Ejecutivo)
**Ruta:** `POST /api/mobile/postventa/payments/review`
**Uso:** El ejecutivo de postventa ve el comprobante pendiente en la app móvil y decide si está correcto.

**Payload de Aprobación:**
```json
{
  "receiptId": "rec-001",
  "action": "APPROVE"
}
```

**Payload de Rechazo:**
```json
{
  "receiptId": "rec-001",
  "action": "REJECT",
  "rejectionReason": "La foto del comprobante está borrosa y no se distingue el monto"
}
```

---

## 3. Lógica del Calculador Interno de la App (Si el usuario paga)

Si la App tiene un "Selector de Cuotas" (Ej: "Quiero pagar 3 cuotas juntas"), necesitarás una función interna en JavaScript/TypeScript (Front-end) que cruce el `paidCuotas` actual con los `legacyInstallmentRanges` para dar el precio exacto a transferir:

```typescript
function calcularTotalAPagar(
    cantidadCuotas: number, 
    account: MobileReservationAccount, 
    financials: MobileLotFinancials
): number {
    let totalPago = 0;
    
    for (let i = 0; i < cantidadCuotas; i++) {
        const numeroCobroActual = account.installmentsPaid + 1 + i;
        
        // 1. Es la última cuota?
        if (numeroCobroActual === financials.totalCuotas) {
            totalPago += financials.valorUltimaCuota;
            continue;
        }
        
        // 2. ¿El cliente excepcionalmente tenía un trato especial para este número de cuota?
        let excepcionAplicada = false;
        if (financials.legacyInstallmentRanges && financials.legacyInstallmentRanges.length > 0) {
            for (const range of financials.legacyInstallmentRanges) {
                if (numeroCobroActual >= range.from && numeroCobroActual <= range.to) {
                    totalPago += range.amount;
                    excepcionAplicada = true;
                    break;
                }
            }
        }
        
        // 3. Valor standard de contrato
        if (!excepcionAplicada) {
            totalPago += financials.valorCuotaNormal;
        }
    }
    
    // Al final, sumar los intereses o multas por atraso si las hubiere para el primer cobro
    // Asumiendo que accounts.penaltyAmountClp representa la multa de la 1era cuota impaga
    totalPago += account.penaltyAmountClp;
    
    return totalPago;
}
```
