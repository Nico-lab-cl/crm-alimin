const META_ACCESS_TOKEN = "EAAYE9hI2Fx4BQ6HGM52rPoS1MisjEYXz2xwn1tu0AWuqPbqJBrCjNlJfjYa6sv5QNBioMvQnk0bbaS4i4ZCsU4eDhrAqSl046ZAL0xCN3ZA1Y08Ynop5KI6hIM3k5UNj2ki5HJWtlSModbWlEnIK6UbzXnmBUn0J9hp7DZBUG2xQBmDZAshUwzCeS3h5YfPGenQZDZD";
const META_PIXEL_ID = "1599982444486132";

const payload = {
    test_event_code: 'TEST68872',
    data: [
        {
            event_name: 'ViewContent',
            event_time: Math.floor(Date.now() / 1000),
            action_source: 'website',
            event_source_url: 'https://aliminlomasdelmar.com/',
            user_data: {
                client_ip_address: '190.160.0.1',
                client_user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            },
            custom_data: {
                currency: 'CLP',
                value: 500000
            }
        }
    ]
};

const apiUrl = `https://graph.facebook.com/v19.0/${META_PIXEL_ID}/events?access_token=${META_ACCESS_TOKEN}`;

console.log("Enviando petición de prueba a Meta API...");
fetch(apiUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
})
    .then(res => res.json())
    .then(data => {
        console.log("Respuesta de Meta:");
        console.log(JSON.stringify(data, null, 2));
    })
    .catch(err => console.error("Error fatal:", err));
