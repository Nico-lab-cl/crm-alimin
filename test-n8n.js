const paymentWebhookUrl = "https://n8n-n8n.yszha2.easypanel.host/webhook/7b928d3b-2850-462d-87df-f6a87fe4108a";

async function testN8NWebhook() {
    const payload = {
        contact_name: "Usuario de Prueba N8N",
        contact_email: "prueba.webhook@lomasdelmar.cl",
        contact_phone: "+56911223344",
        contact_rut: "19.876.543-2",
        contact_address: "Avenida Siempreviva 742",
        lot_number: "999-TEST",
        lot_id: 9999,
        lot_stage: 1,
        lot_area_m2: 5000,
        lot_total_price: 45000000,
        amount_paid: 500000,
        transbank_order_id: "TEST-ORDER-" + Date.now(),
        authorization_code: "123456",
        payment_status: "approved",
        timestamp: new Date().toISOString(),
        reservation_id: "test-res-uuid-1234",
        folio: "BOL-TEST1234",
        token_ws: "test_token_890",
        webpay_status: "AUTHORIZED",
        response_code: 0,
        payment_type_code: "VD",
        installments_number: 0,
        scope: "RESERVATION",
        user_id: "test-user-id"
    };

    console.log("🚀 Enviando payload de prueba a N8N...");
    console.log(JSON.stringify(payload, null, 2));

    try {
        const res = await fetch(paymentWebhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (!res.ok) {
            const errText = await res.text();
            console.error("❌ N8N Webhook rechazó la petición:");
            console.error(`HTTP Status: ${res.status}`);
            console.error(`Respuesta de N8N: ${errText}`);
        } else {
            console.log("✅ N8N Webhook disparado exitosamente con HTTP 200/OK");
            try {
                const jsonRes = await res.json();
                console.log("Respuesta de N8N:", jsonRes);
            } catch (e) {
                console.log("N8N no devolvió JSON (o devolvió texto plano)");
            }
        }
    } catch (e) {
        console.error("💥 Error fatal al conectar con N8N:", e.message);
    }
}

testN8NWebhook();
