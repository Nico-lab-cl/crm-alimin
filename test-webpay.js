async function testWebpayCreate() {
    try {
        const payload = {
            lotId: 132,
            sessionId: "test-session-123",
            name: "Test User",
            email: "test@example.com",
            phone: "+56912345678",
            rut: "11.111.111-1", // Valid format
            marital_status: "Soltero",
            profession: "Ingeniero",
            nationality: "Chilena",
            address_street: "Calle Test",
            address_number: "123",
            address_commune: "Las Condes",
            address_region: "Metropolitana"
        };

        console.log("Sending payload to https://aliminlomasdelmar.com/api/webpay/create:", payload);

        const response = await fetch('https://aliminlomasdelmar.com/api/webpay/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'User-Agent': 'Meta_Test_Script/1.0'
            },
            body: JSON.stringify(payload)
        });

        const data = await response.json();
        console.log("Response Status:", response.status);
        console.log("Response Data:", JSON.stringify(data, null, 2));

    } catch (err) {
        console.error("Test failed:", err);
    }
}

testWebpayCreate();
