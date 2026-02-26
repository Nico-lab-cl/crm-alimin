const https = require('https');

https.get('https://aliminlomasdelmar.com/', (res) => {
    let data = '';
    res.on('data', (chunk) => {
        data += chunk;
    });
    res.on('end', () => {
        if (data.includes('1599982444486132')) {
            console.log('EXITO: El ID del Pixel 1599982444486132 SI ESTÁ en el código en vivo.');
        } else if (data.includes('124174543556349')) {
            console.log('ERROR: El código en vivo tiene el ID viejo (Business ID 124174543556349). ¡No se ha actualizado!');
        } else if (data.includes('REPLACE_WITH_YOUR_PIXEL_ID')) {
            console.log('ERROR: El código en vivo todavía tiene el texto de relleno "REPLACE_WITH_YOUR_PIXEL_ID". ¡No se ha actualizado!');
        } else {
            console.log('ERROR: No se encontró ningún ID de Pixel en el código en vivo.');
        }
    });
}).on('error', (err) => {
    console.log('Error fetching website:', err.message);
});
