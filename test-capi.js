const crypto = require('crypto');

const META_ACCESS_TOKEN = "EAAYE9hI2Fx4BQ6HGM52rPoS1MisjEYXz2xwn1tu0AWuqPbqJBrCjNlJfjYa6sv5QNBioMvQnk0bbaS4i4ZCsU4eDhrAqSl046ZAL0xCN3ZA1Y08Ynop5KI6hIM3k5UNj2ki5HJWtlSModbWlEnIK6UbzXnmBUn0J9hp7DZBUG2xQBmDZAshUwzCeS3h5YfPGenQZDZD";
const META_PIXEL_ID = "1599982444486132";

function hashData(data) {
    if (!data) return null;
    return crypto.createHash('sha256').update(data.trim().toLowerCase()).digest('hex');
}

async function testCAPI() {
    const payload = {
        data: [
            {
                event_name: 'Purchase',
                event_time: Math.floor(Date.now() / 1000),
                action_source: 'website',
                event_id: 'test_local_purchase_' + Date.now(),
                user_data: {
                    em: [hashData('test@example.com')],
                    ph: [hashData('56912345678')],
                    client_ip_address: '190.114.37.18', // Valid IP
                    client_user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
                },
                custom_data: {
                    currency: 'CLP',
                    value: 500000,
                    content_name: 'Reserva Lote 16'
                }
            }
        ],
        test_event_code: 'TEST82282' // Add test event code to see it right away
    };

    const apiUrl = `https://graph.facebook.com/v19.0/${META_PIXEL_ID}/events?access_token=${META_ACCESS_TOKEN}`;

    try {
        console.log("Sending CAPI Event...");
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        const result = await response.json();

        if (!response.ok) {
            console.error(`[Meta CAPI Error] HTTP ${response.status}`, JSON.stringify(result, null, 2));
        } else {
            console.log(`[Meta CAPI Success]`, result);
        }
    } catch (e) {
        console.error("Fetch Exception:", e);
    }
}

testCAPI();
