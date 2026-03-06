import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image, Font } from '@react-pdf/renderer';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

// Registrar tipografías si lo deseas, pero Helvetica es la estándar por defecto.
// Para facturas formales funciona bien Helvetica.

const styles = StyleSheet.create({
    page: {
        padding: 40,
        fontFamily: 'Helvetica',
        backgroundColor: '#ffffff',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 40,
        borderBottomWidth: 2,
        borderBottomColor: '#36595F',
        paddingBottom: 20,
    },
    logo: {
        width: 140, // Ajusta según el logo real
    },
    headerTextRight: {
        textAlign: 'right',
        color: '#36595F',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 5,
        color: '#36595F',
    },
    receiptNumber: {
        fontSize: 12,
        color: '#666666',
        fontWeight: 'bold',
    },
    section: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#36595F',
        backgroundColor: '#f1f5f9',
        padding: 8,
        marginBottom: 10,
        borderRadius: 4,
    },
    row: {
        flexDirection: 'row',
        marginBottom: 8,
    },
    label: {
        width: '35%',
        fontSize: 11,
        color: '#666666',
        fontWeight: 'bold',
    },
    value: {
        width: '65%',
        fontSize: 11,
        color: '#000000',
    },
    tableBox: {
        marginTop: 20,
        borderWidth: 1,
        borderColor: '#e2e8f0',
        borderRadius: 4,
        overflow: 'hidden',
    },
    tableHeaderRow: {
        flexDirection: 'row',
        backgroundColor: '#36595F',
        padding: 10,
    },
    tableHeaderCellItem: {
        width: '60%',
        color: '#ffffff',
        fontSize: 10,
        fontWeight: 'bold',
    },
    tableHeaderCellAmount: {
        width: '40%',
        color: '#ffffff',
        fontSize: 10,
        fontWeight: 'bold',
        textAlign: 'right',
    },
    tableRow: {
        flexDirection: 'row',
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#e2e8f0',
    },
    tableCellItem: {
        width: '60%',
        fontSize: 11,
        color: '#333333',
    },
    tableCellAmount: {
        width: '40%',
        fontSize: 11,
        textAlign: 'right',
        color: '#000000',
        fontWeight: 'bold',
    },
    totalRow: {
        flexDirection: 'row',
        padding: 12,
        backgroundColor: '#f8fafc',
    },
    totalLabel: {
        width: '60%',
        fontSize: 12,
        fontWeight: 'bold',
        color: '#36595F',
        textAlign: 'right',
        paddingRight: 20,
    },
    totalAmount: {
        width: '40%',
        fontSize: 14,
        fontWeight: 'bold',
        color: '#36595F',
        textAlign: 'right',
    },
    footer: {
        position: 'absolute',
        bottom: 40,
        left: 40,
        right: 40,
        textAlign: 'center',
        paddingTop: 20,
        borderTopWidth: 1,
        borderTopColor: '#e2e8f0',
    },
    footerText: {
        fontSize: 9,
        color: '#666666',
        marginBottom: 4,
    },
    stampContainer: {
        alignItems: 'center',
        marginTop: 40,
    },
    stampOval: {
        borderWidth: 2,
        borderColor: '#ef4444', // Rojo para el timbre de "PAGADO"
        paddingVertical: 10,
        paddingHorizontal: 30,
        borderRadius: 4,
        transform: 'rotate(-5deg)',
    },
    stampText: {
        color: '#ef4444',
        fontSize: 22,
        fontWeight: 'bold',
        letterSpacing: 2,
    }
});

interface PaymentReceiptPDFProps {
    receiptId: string;
    receiptDate: Date;
    clientName: string;
    clientRut: string;
    clientEmail: string;
    lotNumber: string;
    lotStage: number;
    amountPaid: number;
    paymentScope: 'PIE' | 'INSTALLMENT' | string;
    installmentsCount?: number;
    base64Logo: string;
}

export const PaymentReceiptPDF = ({
    receiptId,
    receiptDate,
    clientName,
    clientRut,
    clientEmail,
    lotNumber,
    lotStage,
    amountPaid,
    paymentScope,
    installmentsCount = 0,
    base64Logo
}: PaymentReceiptPDFProps) => {

    // Helper text logic
    const isCuotas = paymentScope === 'INSTALLMENT';
    const itemName = isCuotas
        ? `Pago de ${installmentsCount} Cuota(s)`
        : paymentScope === 'PIE'
            ? 'Pago de Pie'
            : 'Pago de Reserva';

    const shortId = receiptId.split('-')[0].toUpperCase();

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                {/* Header */}
                <View style={styles.header}>
                    {base64Logo ? (
                        <Image src={base64Logo} style={styles.logo} />
                    ) : (
                        <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#36595F' }}>LOMAS DEL MAR</Text>
                    )}
                    <View style={styles.headerTextRight}>
                        <Text style={styles.title}>RECIBO DE PAGO</Text>
                        <Text style={styles.receiptNumber}>Nº {shortId}</Text>
                        <Text style={{ fontSize: 10, color: '#666', marginTop: 4 }}>
                            Fecha Emisión: {format(new Date(), "dd 'de' MMMM, yyyy", { locale: es })}
                        </Text>
                    </View>
                </View>

                {/* Info Cliente */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Datos del Cliente</Text>
                    <View style={styles.row}>
                        <Text style={styles.label}>Nombre / Razón Social:</Text>
                        <Text style={styles.value}>{clientName}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.label}>RUT:</Text>
                        <Text style={styles.value}>{clientRut || 'No especificado'}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.label}>Correo Electrónico:</Text>
                        <Text style={styles.value}>{clientEmail}</Text>
                    </View>
                </View>

                {/* Info Terreno */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Detalle del Proyecto</Text>
                    <View style={styles.row}>
                        <Text style={styles.label}>Proyecto:</Text>
                        <Text style={styles.value}>Lomas del Mar</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.label}>Nº Parcela / Unidad:</Text>
                        <Text style={styles.value}>{lotNumber}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.label}>Polígono / Etapa:</Text>
                        <Text style={styles.value}>{lotStage}</Text>
                    </View>
                </View>

                {/* Tabla de Cobros */}
                <View style={styles.tableBox}>
                    <View style={styles.tableHeaderRow}>
                        <Text style={styles.tableHeaderCellItem}>CONCEPTO</Text>
                        <Text style={styles.tableHeaderCellAmount}>CANTIDAD (CLP)</Text>
                    </View>

                    <View style={styles.tableRow}>
                        <Text style={styles.tableCellItem}>{itemName} - Lote {lotNumber}</Text>
                        <Text style={styles.tableCellAmount}>
                            {new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(amountPaid)}
                        </Text>
                    </View>

                    <View style={styles.totalRow}>
                        <Text style={styles.totalLabel}>TOTAL RECIBIDO</Text>
                        <Text style={styles.totalAmount}>
                            {new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(amountPaid)}
                        </Text>
                    </View>
                </View>

                {/* Sello de Pagado */}
                <View style={styles.stampContainer}>
                    <View style={styles.stampOval}>
                        <Text style={styles.stampText}>RECIBIDO / PAGADO</Text>
                        <Text style={{ textAlign: 'center', fontSize: 8, color: '#ef4444', marginTop: 4 }}>
                            {format(receiptDate, "dd/MM/yyyy HH:mm", { locale: es })}
                        </Text>
                    </View>
                </View>

                {/* Footer */}
                <View style={styles.footer}>
                    <Text style={styles.footerText}>
                        Alimin Lomas del Mar SpA. - 77.587.618-2 - Manuel Bulnes 509, Of. 301, Temuco, Chile.
                    </Text>
                    <Text style={styles.footerText}>
                        Este documento es un comprobante de pago electrónico. Conserva este recibo para tus registros.
                    </Text>
                    <Text style={styles.footerText}>
                        Para cualquier consulta, por favor contáctanos a soporte@aliminlomasdelmar.com
                    </Text>
                </View>
            </Page>
        </Document>
    );
};
