import React from 'react';
import { Page, Text, View, Document, StyleSheet, Font, Image } from '@react-pdf/renderer';

// Register fonts
Font.register({
    family: 'Helvetica',
    fonts: [
        { src: 'https://fonts.gstatic.com/s/helveticaneue/v70/1Ptsg8zYS_SKggPNyCg4TYFqL_uE.woff2' },
        { src: 'https://fonts.gstatic.com/s/helveticaneue/v70/1Ptsg8zYS_SKggPNyCg4TYFqL_uE.woff2', fontWeight: 'bold' },
    ]
});

const styles = StyleSheet.create({
    page: {
        paddingTop: 50,
        paddingBottom: 50,
        paddingHorizontal: 60,
        fontFamily: 'Helvetica',
        fontSize: 10,
        lineHeight: 1.5,
        color: '#000000',
    },
    title: {
        fontSize: 12,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        marginBottom: 20,
        textAlign: 'center',
        textDecoration: 'underline'
    },
    paragraph: {
        marginBottom: 10,
        textAlign: 'justify',
    },
    indentedParagraph: {
        marginBottom: 8,
        textAlign: 'justify',
        paddingLeft: 20,
    },
    bold: {
        fontWeight: 'bold',
    },
    signatureSection: {
        marginTop: 60,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
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
        marginBottom: -10,
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
        timeZone: 'America/Santiago'
    });

    const buyerName = reservation.name || "NO INFORMADO";
    const buyerMaritalStatus = reservation.marital_status?.toLowerCase() || "soltero/a";
    const buyerProfession = reservation.profession?.toLowerCase() || "sin especificar";
    const buyerRut = reservation.rut || "NO INFORMADO";

    // Construct full address
    const street = reservation.address_street || reservation.address || "NO INFORMADO";
    const number = reservation.address_number ? `Nº ${reservation.address_number}` : "";
    const commune = reservation.address_commune ? `, ${reservation.address_commune}` : "";
    const region = reservation.address_region ? `, ${reservation.address_region}` : "";
    const buyerAddress = `${street} ${number}${commune}${region}`.trim();

    // Financial calculations
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(amount || 0);
    };

    const totalCalculatedStr = formatCurrency(lot?.price_total_clp);
    const reservaStr = formatCurrency(lot?.reserva || 500000);
    const pieStr = formatCurrency(lot?.pie);

    const qtyCuotas = lot?.cuotas || 0;
    const valorCuotaStr = formatCurrency(lot?.valor_cuota);
    const saldoTotalStr = formatCurrency((lot?.valor_cuota || 0) * qtyCuotas);

    const loteNum = lot?.number || "NO INFORMADO";
    const loteEtapa = lot?.stage || "NO INFORMADO";
    const loteM2 = lot?.area_m2 || "NO INFORMADO";

    return (
        <Document>
            <Page size="LEGAL" style={styles.page}>
                <View>
                    <Text style={styles.title}>PROMESA DE COMPRAVENTA</Text>

                    <Text style={styles.paragraph}>
                        En Santiago, Región Metropolitana, a {currentDate}, comparecen: Por una parte: <Text style={styles.bold}>{repName}</Text>, chileno/a, cédula nacional de identidad número <Text style={styles.bold}>{repRut}</Text>, domiciliado/a en Hijuela 3 camino antiguo algarrobo El Tabo, Región Valparaíso, y en representación de Alimin Lomas del Mar SpA con mandato especial, fecha {currentDate} del giro de su denominación, Rut setenta y ocho millones ciento setenta y cuatro mil seiscientos trece guión cuatro, todos domiciliados para estos efectos en Hijuela 3 camino antiguo algarrobo El Tabo, Región Valparaíso, cuya personería se acreditará más adelante, en adelante también indistintamente denominada como 'el promitente vendedor', y por la parte compradora, <Text style={styles.bold}>{buyerName}</Text>, {buyerMaritalStatus}, {buyerProfession}, cédula de identidad número <Text style={styles.bold}>{buyerRut}</Text>, domiciliado/a en {buyerAddress}, en adelante también indistintamente denominado como 'El Promitente Comprador', todos mayores de edad, quienes acreditaron sus identidades con las cédulas ya citadas y exponen que han convenido en la siguiente promesa de compraventa:
                    </Text>

                    <Text style={styles.paragraph}>
                        <Text style={styles.bold}>PRIMERO: ANTECEDENTES.</Text> Alimin Lomas Del Mar SpA, es dueño del siguiente Inmueble: Lote {loteNum} ubicado en Las Cruces, comuna El Tabo, Provincia de San Antonio de una superficie total de 12 hectáreas según escritura cuyos deslindes y medidas son: Al Norte: en cuatrocientos cuarenta metros con una línea quebrada con mina de cal y en doscientos treinta metros cincuenta centímetros también con mina de cal; Al Sur: en quinientos diez metros más o menos, con propiedad que se adjudicó a doña Zulema Romero González; Oriente: en ciento veinte metros con mina de cal, y Poniente: en línea quebrada de dos trazos de noventa metros y ciento veinte metros respectivamente con camino público antiguo a El Tabo. La inscripción de dominio rola a fojas 4656V, número 5484 del año 2025 en el conservador de Bienes raíces de San Antonio adquirida por sucesión de doña Maria Elsa Romero Jorquera que consta de certificado de posesión efectiva otorgado por el servicio de registro civil e identificación con inscripción número 22700 año 2017 . El bien raíz está amparado bajo el Rol de avalúo fiscal número 680 - 806 Comuna de El Tabo.
                    </Text>

                    <Text style={styles.paragraph}>
                        <Text style={styles.bold}>SEGUNDO: </Text>Por el presente instrumento, la promitente vendedora debidamente representada promete vender, ceder y transferir a {buyerName}, quien promete comprar, aceptar y adquirir para sí, el inmueble correspondiente al que va a ser identificado con el sitio referencial número {loteNum} ETAPA {loteEtapa}, de una superficie aproximada de {loteM2} metros cuadrados, sobre el lote 5 de la cláusula primera precedente. El bien objeto del presente contrato se vende en verde y se hará entrega del sitio en uso una vez aprobado el plano por la Dirección de Obras Municipales de la Ilustre Municipalidad de El Tabo.
                    </Text>

                    <Text style={styles.paragraph}>
                        <Text style={styles.bold}>TERCERO: PRECIO. </Text>El precio de la compraventa prometida del sitio objeto de negociación, corresponde a la suma de {totalCalculatedStr}, que el promitente comprador paga y pagará al promitente vendedor, de la siguiente forma:
                    </Text>

                    <Text style={styles.indentedParagraph}>a) Una Reserva ya cancelada con anterioridad a este acto, por la suma de {reservaStr}, que formará parte íntegra del pie del terreno.</Text>
                    <Text style={styles.indentedParagraph}>b) Con un Pie que el promitente comprador paga al vendedor de la siguiente manera: Al momento de firmar la promesa de compraventa se pagará la suma de {pieStr}, mediante transferencia, con un plazo máximo de 2 días, desde firmada dicha promesa.</Text>
                    <Text style={styles.indentedParagraph}>c) Y el Saldo restante, es decir la cantidad de {saldoTotalStr}, que se pagarán cancelados en {qtyCuotas} cuotas iguales y sucesivas de {valorCuotaStr}, comenzando a pagar la primera de ellas el día cinco del mes siguiente a la total tramitación de este contrato y así sucesivamente, hasta completar las {qtyCuotas} cuotas.</Text>
                    <Text style={styles.indentedParagraph}>d) El promitente comprador debe realizar el pago de las cuotas pactadas en la letra anterior dentro de los primeros 5 días de cada mes, las que serán canceladas mediante depósito y/o transferencia electrónica de fondos, el cual servirá de recibo suficiente de pago de la respectiva cuota.</Text>
                    <Text style={styles.indentedParagraph}>e) El retardo en el cumplimento de las obligaciones por no pago de alguna de las cuotas, se le imputara un interés diario de 10.000 mil pesos a contar del día once. Para regularizar la cuota base y los intereses generados por día de atraso, ambas, deberán cancelarse en la misma transacción.</Text>
                    <Text style={styles.indentedParagraph}>f) El retardo en el cumplimiento de la obligación por no pago de tres cuotas consecutivas por parte Compradora facultará a Alimin Lomas Del Mar Spa para ejercer conjuntamente los siguientes derechos: a) Dar por terminado ipso-facto el contrato, sin necesidad de trámite ni declaración judicial alguna y, por lo tanto, a exigir la inmediata devolución del bien sin derecho alguno de restitución o devolución de lo pagado y construido, renunciando desde ya el promitente comprador a oponerse a ello de cualquier forma, quedando el bien disponible para la venta. b) Exigir el pago de la totalidad del valor del terreno hasta la terminación del plazo pactado, como si fueran de plazo vencido. Lo estipulado en esta cláusula es sin perjuicio del derecho de Alimin Lomas Del Mar Spa a cobrar intereses moratorios. C) Dará derecho a que el promitente vendedor, en caso de que la parte compradora no pague el saldo de precio, de dejar para su propiedad lo edificado o construido en la propiedad.</Text>

                    <Text style={styles.paragraph}>
                        <Text style={styles.bold}>CUARTO: </Text>Las partes acuerdan que la escritura de compraventa definitiva deberá celebrarse una vez el terreno esté completamente cancelado y que la Dirección de Obras Municipales de la Municipalidad de El Tabo haga entrega del certificado de recepción definitiva de la obra. Se deja constancia que el plano puede tener modificaciones durante la ejecución del proyecto, siempre respetando el metraje del terreno y ubicación. Asimismo podría surgir modificaciones el proyecto a petición del diseño de arquitectura.
                    </Text>

                    <Text style={styles.paragraph}>
                        <Text style={styles.bold}>QUINTA: ENTREGA MATERIAL.</Text> La entrega material del {loteNum}, ETAPA {loteEtapa}, que se promete vender en este contrato se efectuará una vez aprobado el plano por la Dirección de Obras Municipales de la Ilustre Municipalidad de El Tabo. Por este acto la inmobiliaria hace entrega del terreno ya individualizado, sin embargo, no se recomienda comenzar la ejecución de obras de edificación hasta el total e íntegro pago del precio de venta del mismo inmueble. Una vez realizada la entrega material se deja constancia que cualquier siniestro ya sea incendios, terremoto, tsunami, erupción volcánica, etc, la inmobiliaria no se hace responsable de daños posterior a la entrega está será exclusiva responsabilidad del cliente, de acuerdo con lo dispuesto por el Reglamento de copropiedad que se describe más adelante.
                    </Text>

                    <Text style={styles.paragraph}>
                        <Text style={styles.bold}>SEXTA: </Text>ALIMIN LOMAS DEL MAR SPA garantiza que el inmueble permanecerá libre de ocupaciones y usurpaciones, hasta su entrega con las obras de urbanización terminadas, asumiendo hasta esa condición, su resguardo y recuperación frente a terceros.
                    </Text>

                    <Text style={styles.paragraph}>
                        <Text style={styles.bold}>SEPTIMA: </Text>Se fija desde ya una cláusula penal ascendiente a la suma del valor total del terreno y la resciliación del contrato, llegado el caso que cualquiera de las partes no concurra con la firma de la compraventa definitiva una vez recepcionado e inscrito dicho lote en el conservador de bienes raíces de San Antonio y una vez cancelada la última cuota.
                    </Text>

                    <Text style={styles.paragraph}>
                        <Text style={styles.bold}>OCTAVA: FORMA DE VENTA. </Text>El inmueble singularizado en la cláusula primera de este instrumento se promete vender y comprar como especie o cuerpo cierto, en el estado material y jurídico en que actualmente se encuentra. La propiedad es conocida y aceptada por el promitente comprador, con todos sus usos, deslindes actuales, derechos, costumbres y servidumbres activas y pasivas, libre de prohibiciones, embargos, medidas precautorias, litigios y deudas; con sus títulos y autorizaciones municipales ajustados a derecho, obligándose el promitente vendedor al saneamiento en conformidad a la ley. La parte promitente vendedora a través de sus representantes, CONSTITUYEN PROHIBICIÓN, de celebrar actos y contratos sobre el inmueble denominado sitio {loteNum}, ETAPA {loteEtapa}, materia de la presente convención, singularizado en la cláusula segunda, que no sea el contrato prometido durante la vigencia de éste.
                    </Text>

                    <Text style={styles.paragraph}>
                        <Text style={styles.bold}>NOVENA: GASTOS OPERACIONALES. </Text>Los gastos que se deriven directamente del otorgamiento del presente contrato de promesa de compraventa y de la escritura de compraventa definitiva, el impuesto de timbre y estampillas y los gastos de inscripción en el Conservador de Bienes Raíces respectivo serán pagados por la parte compradora.
                    </Text>

                    <Text style={styles.paragraph}>
                        <Text style={styles.bold}>DECIMA: ARBITRAJE. </Text>Cualquier dificultad que se suscite entre las partes respecto del cumplimiento o incumplimiento, como asimismo de su validez, vigencia, resolución o nulidad, y de la ejecución de la cláusula penal de la cláusula sexta, será resuelta por un Árbitro de Derecho, el cual será nombrado de mutuo acuerdo de las partes. A falta de este acuerdo, la persona del árbitro será designado por los Tribunales Ordinarios de Justicia. Para todos los efectos legales, las partes constituyen domicilio en la comuna y ciudad de San Antonio y se someten a la jurisdicción de sus tribunales de justicia.
                    </Text>

                    <Text style={styles.paragraph}>
                        <Text style={styles.bold}>UNDÉCIMO: </Text>El Lote {loteNum}, ETAPA {loteEtapa}, forma parte del condominio “Lomas del Mar” que incluye: empalme eléctrico; arranque de agua, agua de pozo certificada por la SEREMI de salud de la región de Valparaíso, la cual no tiene costo mensual. La inmobiliaria no cobra gastos comunes, por ende, el costo de mantención de sala de máquinas y lugar, corresponde a los promitentes propietarios comunidad de “Alimin Lomas Del Mar”. Sin perjuicio de lo anterior, una vez que el condominio sea entregado a la comunidad, ésta será responsable del mantenimiento de la infraestructura y equipamiento, para lo cual se deberá conformar un comité que deberá velar por el cumplimiento de la mantención del condominio. El cierre del terreno es responsabilidad del cliente, el terreno tiene una superficie aproximadamente de {loteM2} metros cuadrados, con rol propio.
                    </Text>
                </View>

                {/* SIGNATURES */}
                <View style={styles.signatureSection} wrap={false}>
                    <View style={styles.signatureBlock}>
                        {signaturePath ? (
                            <Image src={signaturePath} style={styles.signatureImage} />
                        ) : (
                            <View style={{ height: 50 }} />
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
