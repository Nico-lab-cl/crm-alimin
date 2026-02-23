import React from 'react';
import { Page, Text, View, Document, StyleSheet, Font, Image } from '@react-pdf/renderer';

// Register fonts for rendering
Font.register({
    family: 'Helvetica',
    fonts: [
        { src: 'https://fonts.gstatic.com/s/helveticaneue/v70/1Ptsg8zYS_SKggPNyCg4TYFqL_uE.woff2' },
        { src: 'https://fonts.gstatic.com/s/helveticaneue/v70/1Ptsg8zYS_SKggPNyCg4TYFqL_uE.woff2', fontWeight: 'bold' },
    ]
});

const styles = StyleSheet.create({
    page: {
        padding: 40,
        fontFamily: 'Helvetica',
        fontSize: 11,
        lineHeight: 1.5,
        color: '#212529',
    },
    header: {
        marginBottom: 30,
        textAlign: 'center',
    },
    logo: {
        width: 150,
        marginBottom: 20,
        alignSelf: 'center',
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        marginBottom: 10,
        textDecoration: 'underline'
    },
    paragraph: {
        marginBottom: 15,
        textAlign: 'justify',
    },
    bold: {
        fontWeight: 'bold',
    },
    signatureSection: {
        marginTop: 60,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
    },
    signatureBlock: {
        width: 200,
        alignItems: 'center',
    },
    signatureLine: {
        width: '100%',
        borderBottomWidth: 1,
        borderBottomColor: '#000',
        marginBottom: 5,
    },
    signatureImage: {
        width: 120,
        height: 60,
        objectFit: 'contain',
        marginBottom: -10, // Pull it down slightly onto the line
        zIndex: -1,
    }
});

interface PromesaContractProps {
    reservation: any;
    lot: any;
    logoPath: string;
    signaturePath: string | null;
    repName: string;
    repRut: string;
    repRole: string;
}

export const PromesaCompraventaContract: React.FC<PromesaContractProps> = ({
    reservation,
    lot,
    logoPath,
    signaturePath,
    repName,
    repRut,
    repRole
}) => {
    const currentDate = new Date().toLocaleDateString('es-CL', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    const buyerName = reservation.name || "NO INFORMADO";
    const buyerMaritalStatus = reservation.marital_status || "NO INFORMADO";
    const buyerProfession = reservation.profession || "NO INFORMADO";
    const buyerRut = reservation.rut || "NO INFORMADO";

    // Construct full address
    const street = reservation.address_street || reservation.address || "NO INFORMADO";
    const number = reservation.address_number ? `Nº ${reservation.address_number}` : "";
    const commune = reservation.address_commune ? `, ${reservation.address_commune}` : "";
    const region = reservation.address_region ? `, ${reservation.address_region}` : "";
    const buyerAddress = `${street} ${number}${commune}${region}`.trim();

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <View style={styles.header}>
                    {logoPath && <Image src={logoPath} style={styles.logo} />}
                    <Text style={styles.title}>PROMESA DE COMPRAVENTA</Text>
                </View>

                <View>
                    <Text style={styles.paragraph}>
                        En Santiago, Región Metropolitana, a {currentDate}, comparecen: Por una parte: <Text style={styles.bold}>{repName}</Text>, chileno/a, cédula nacional de identidad número <Text style={styles.bold}>{repRut}</Text>, domiciliado/a en Hijuela 3 camino antiguo algarrobo El Tabo, Región Valparaíso, en representación de Alimin Lomas del Mar SpA, con Rut 78.174.613-4, en adelante 'el promitente vendedor', y por la parte compradora, <Text style={styles.bold}>{buyerName}</Text>, {buyerMaritalStatus}, {buyerProfession}, cédula de identidad número <Text style={styles.bold}>{buyerRut}</Text>, domiciliado/a en {buyerAddress}, en adelante 'El Promitente Comprador'.
                    </Text>

                    <Text style={styles.paragraph}>
                        <Text style={styles.bold}>PRIMERO: ANTECEDENTES.</Text> Alimin Lomas Del Mar SpA, es dueño del siguiente Inmueble: Lote {lot?.number || "NO INFORMADO"} ubicado en la comuna El Tabo, Provincia de San Antonio de una superficie aproximada de {lot?.area_m2 || "NO INFORMADO"} metros cuadrados. Etapa {lot?.stage || "NO INFORMADO"}.
                    </Text>
                </View>

                {/* Additional clauses would go here... Currently using base text from requirements */}

                <View style={styles.signatureSection}>
                    <View style={styles.signatureBlock}>
                        {signaturePath ? (
                            <Image src={signaturePath} style={styles.signatureImage} />
                        ) : (
                            <View style={{ height: 50 }} /> // Placeholder height
                        )}
                        <View style={styles.signatureLine} />
                        <Text style={{ fontSize: 10, fontWeight: 'bold' }}>{repName}</Text>
                        <Text style={{ fontSize: 9 }}>RUT: {repRut}</Text>
                        <Text style={{ fontSize: 9 }}>{repRole}</Text>
                        <Text style={{ fontSize: 9 }}>Alimin Lomas del Mar SpA</Text>
                    </View>

                    <View style={styles.signatureBlock}>
                        <View style={{ height: 50 }} />
                        <View style={styles.signatureLine} />
                        <Text style={{ fontSize: 10, fontWeight: 'bold' }}>{buyerName}</Text>
                        <Text style={{ fontSize: 9 }}>RUT: {buyerRut}</Text>
                        <Text style={{ fontSize: 9 }}>Promitente Comprador</Text>
                    </View>
                </View>
            </Page>
        </Document>
    );
};
