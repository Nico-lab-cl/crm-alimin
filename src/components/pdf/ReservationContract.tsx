import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image, Font } from '@react-pdf/renderer';
import { Reservation, Lot as PrismaLot } from '@prisma/client';

// Register fonts if needed, but standard ones are built-in (Helvetica, Times-Roman)
// Font.register({ family: 'Roboto', src: 'path/to/font' });

interface ReservationContractProps {
    reservation: Reservation & {
        signed_at?: Date | null;
        signature_ip?: string | null;
    };
    lot: PrismaLot;
    logoPath: string; // Server-side path to logo
    signaturePath: string; // Server-side path to signature
}

const styles = StyleSheet.create({
    page: {
        paddingTop: 50, // Reduced from 70
        paddingBottom: 50,
        paddingLeft: 60,
        paddingRight: 60,
        fontFamily: 'Helvetica',
        fontSize: 11,
        lineHeight: 1.5,
    },
    header: {
        marginBottom: 10, // Reduced from 20
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    logo: {
        width: 50, // Reduced from 70
        height: 'auto',
    },
    title: {
        marginTop: 20,
        marginBottom: 20,
        fontSize: 14,
        fontWeight: 'bold',
        textAlign: 'center',
        textTransform: 'uppercase',
    },
    text: {
        marginBottom: 10,
        textAlign: 'justify',
    },
    bold: {
        fontWeight: 'bold', // Helvetica-Bold
        fontFamily: 'Helvetica-Bold',
    },
});

const formatCurrency = (amount: number | null | undefined) => {
    if (amount == null) return '$0';
    return '$' + amount.toLocaleString('es-CL');
};

const formatDate = (date: Date) => {
    // Format: "27 de Enero del año dos mil veintiséis"
    // Using Intl for basic formatting, but "dos mil veintiséis" is tricky without a specialized library or hardcoding for current year context.
    // The user requested: "27 de Enero del año dos mil veintiséis".
    // I will use a standard "27 de Enero de 2026" unless I implement a number-to-words converter, which is complex.
    // Given the request "FECHA_ACTUAL_TEXTO" example, I'll try to match it as best as possible with standard JS dates.

    const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' };
    return date.toLocaleDateString('es-ES', options);
};

// Helper strictly for the year to words if needed, or just use digits as fallback
const yearToText = (year: number) => {
    // Simple mapping for likely years? Or just use digits. 
    // Legal documents often use words. 
    // Users instructions: "10 de Marzo del año dos mil veintiséis"
    if (year === 2024) return "dos mil veinticuatro";
    if (year === 2025) return "dos mil veinticinco";
    if (year === 2026) return "dos mil veintiséis";
    if (year === 2027) return "dos mil veintisiete";
    return year.toString();
}

const getFullDateText = (date: Date) => {
    // Force Chile timezone
    const timeZone = 'America/Santiago';

    const day = date.toLocaleDateString('es-CL', { day: 'numeric', timeZone });
    const month = date.toLocaleDateString('es-CL', { month: 'long', timeZone });
    const year = date.toLocaleDateString('es-CL', { year: 'numeric', timeZone });

    // Manual mapping for year to text if really needed, but sticking to digits is safer/easier unless strict requirement.
    // The previous implementation used a helper. We can keep using the numeric year string for the yearToText if we want,
    // or just use the number.
    // Let's use the year string we got.
    const yearNumber = parseInt(year);
    const yearText = yearToText(yearNumber);

    const monthCap = month.charAt(0).toUpperCase() + month.slice(1);

    return `${day} de ${monthCap} del año ${yearText}`;
}


export const ReservationContract = ({ reservation, lot, logoPath, signaturePath }: ReservationContractProps) => {
    // Use reservation creation date as the contract date
    const contractDate = new Date(reservation.created_at);
    const fechaActualTexto = getFullDateText(contractDate);

    const userName = reservation.name.toUpperCase();
    const estadoCivil = reservation.marital_status || 'SOLTERO/A';
    const profesion = reservation.profession || 'OFICIO NO INFORMADO';
    const userRut = reservation.rut || 'SIN RUT';
    const direccionCompleta = [
        reservation.address_street,
        reservation.address_number,
        reservation.address_commune,
        reservation.address_region
    ].filter(Boolean).join(', ') || 'DIRECCIÓN NO INFORMADA';

    const loteNumero = lot.number || 'SN';
    const loteEtapa = lot.stage?.toString() || 'SN'; // Assuming stage is Int in DB
    const precioTotal = formatCurrency(lot.price_total_clp);
    // Explicitly cast to any to avoid local type discrepancies if Prisma client isn't fully synced locally
    const lotAny = lot as any;
    const pieLote = lotAny.pie || 0; // Default or null check
    const valorPieLote = formatCurrency(pieLote);

    const reservaAmount = 500000;
    const saldoPie = Math.max(0, pieLote - reservaAmount);
    const calculoSaldoPie = formatCurrency(saldoPie);

    let textoCuotas = '';
    if (lotAny.cuotas && lotAny.cuotas > 0) {
        const valorCuotaFormatted = formatCurrency(lotAny.valor_cuota);

        if (lotAny.last_installment_amount && lotAny.last_installment_amount > 0) {
            const regularCuotas = lotAny.cuotas - 1;
            const lastInstallmentFormatted = formatCurrency(lotAny.last_installment_amount);
            textoCuotas = `${regularCuotas} cuotas mensuales de ${valorCuotaFormatted} y una última cuota de ${lastInstallmentFormatted}, comenzando la primera cuota a partir del 5 de Marzo`;
        } else {
            textoCuotas = `${lotAny.cuotas} cuotas mensuales de ${valorCuotaFormatted}, comenzando la primera cuota a partir del 5 de Marzo`;
        }
    }

    // Fecha Promesa: Fecha Reserva (created_at) + 10 dias
    // EXCEPTION: Maria Jose Vergara Diaz (request by admin)
    // "La promesa de compraventa deberá firmarse a más tardar con fecha 5 de Marzo del año dos mil veintiséis"
    let fechaPromesa = '';

    if (reservation.email?.toLowerCase().trim() === 'mariajose.vd.25@gmail.com') {
        fechaPromesa = "5 de Marzo del año dos mil veintiséis";
    } else {
        fechaPromesa = "4 de Marzo del año dos mil veintiséis";
    }


    return (
        <Document>
            <Page size="A4" style={styles.page}>
                {/* Header with Logo */}
                <View style={styles.header}>
                    {/* Use absolute path for server-side generation */}
                    {/* If logoPath is valid, image will render */}
                    <Image src={logoPath} style={styles.logo} />
                </View>

                <Text style={styles.title}>CONTRATO RESERVA ALIMIN LOMAS DEL MAR</Text>

                <Text style={styles.text}>
                    Con fecha {fechaActualTexto}, Comparecen: <Text style={styles.bold}>{userName}</Text>, {estadoCivil}, {profesion}, cédula de identidad {userRut}, domiciliada en {direccionCompleta}, en representación de Alimin Lomas del Mar, domiciliado en Hijuela 3 camino antiguo algarrobo comuna El Tabo Región Valparaíso, con Rut número 78.174.613-4, Don Patricio Andrés Escobar Díaz, chileno, soltero, cédula de identidad número 18.147.698-2 representante legal de Alimin.
                </Text>

                <Text style={styles.text}>
                    1- <Text style={styles.bold}>{userName}</Text>, hace entrega en este acto la cantidad de $500.000 pesos chilenos, con pago mediante transferencia a la cuenta de Alimin, quedando de modo reserva por el terreno número {loteNumero} etapa {loteEtapa}, del proyecto Lomas del Mar, el cual, el monto antes indicado será descontado del valor del pie del terreno. El terreno se encuentra ubicado en el tabo nuevo camino costero hijuela 5. IMPORTANTE: El valor del pie se descuenta del precio total del terreno.
                </Text>

                <Text style={styles.text}>
                    2- El precio total del terreno tiene un valor de {precioTotal}, los cuales serán pagados mediante el pago de un pie inicial de {valorPieLote}, menos la reserva de $500.000 ya abonada, quedando un saldo de pie a pagar de {calculoSaldoPie} y {textoCuotas}.
                </Text>

                <Text style={styles.text}>
                    3- El terreno incluirá, empalme de luz, arranque de agua de pozo certificada por la SEREMI de salud y rol propio en un condominio con áreas comunes. El terreno tiene una superficie de {lot.area_m2} metros cuadrados aproximadamente, con rol individual.
                </Text>

                <Text style={styles.text}>
                    4- La venta del terreno reservado se realizará en verde en un "proyecto en construcción", por lo cual la parte compradora ya se encuentra en conocimiento de esto.
                </Text>

                <Text style={styles.text}>
                    5- La promesa de compraventa deberá firmarse a más tardar con fecha {fechaPromesa}.
                </Text>

                <Text style={styles.text}>
                    6- En caso de que la parte compradora desista de la compra, no hay devolución de la reserva.
                </Text>

                {/* Signature Section */}
                <View style={{ marginTop: 50, flexDirection: 'row', justifyContent: 'space-between' }}>
                    <View style={{ width: '45%', alignItems: 'center' }}>
                        {/* Signature Image */}
                        <Image
                            src={signaturePath}
                            style={{ width: 150, height: 80, marginBottom: 10 }}
                        />
                        <View style={{ borderBottomWidth: 1, borderBottomColor: 'black', width: '100%', marginBottom: 5 }} />
                        <Text style={{ fontSize: 10, textAlign: 'center' }}>Patricio Escobar representante legal Alimin</Text>
                        <Text style={{ fontSize: 8, textAlign: 'center' }}>78.174.613-4</Text>
                    </View>

                    <View style={{ width: '45%', alignItems: 'center', justifyContent: 'flex-end' }}>
                        {reservation.signed_at ? (
                            <View style={{
                                width: '100%',
                                borderWidth: 2,
                                borderColor: '#0f3c4c',
                                borderStyle: 'solid',
                                padding: 5,
                                alignItems: 'center',
                                backgroundColor: '#f8fbfc'
                            }}>
                                <Text style={{
                                    fontSize: 8,
                                    color: '#0f3c4c',
                                    fontWeight: 'bold',
                                    marginBottom: 4,
                                    fontFamily: 'Helvetica-Bold'
                                }}>
                                    FIRMADO DIGITALMENTE
                                </Text>
                                <Text style={{
                                    fontSize: 10,
                                    marginBottom: 4,
                                    color: '#000000',
                                    textAlign: 'center',
                                    fontFamily: 'Helvetica-Bold'
                                }}>
                                    {userName}
                                </Text>
                                <Text style={{ fontSize: 7, textAlign: 'center', color: '#555' }}>
                                    RUT: {userRut}
                                </Text>
                                <Text style={{ fontSize: 7, textAlign: 'center', color: '#555' }}>
                                    Fecha: {getFullDateText(new Date(reservation.signed_at))}
                                </Text>
                                <Text style={{ fontSize: 6, textAlign: 'center', color: '#777', marginTop: 2 }}>
                                    Audit IP: {reservation.signature_ip || 'N/A'}
                                </Text>
                            </View>
                        ) : (
                            <View style={{ width: '100%', alignItems: 'center' }}>
                                <View style={{ borderBottomWidth: 1, borderBottomColor: 'black', width: '100%', marginBottom: 5, marginTop: 80 }} />
                                <Text style={{ fontSize: 10, textAlign: 'center' }}>POR CLIENTE</Text>
                                <Text style={{ fontSize: 10, textAlign: 'center' }}>{userName}</Text>
                                <Text style={{ fontSize: 8, textAlign: 'center' }}>{userRut}</Text>
                            </View>
                        )}
                    </View>
                </View>
            </Page>
        </Document>
    );
};
