const fs = require('fs');
const path = require('path');

const signaturePath = path.join(__dirname, 'public', 'firma_patricio_escobar.png');
const outputPath = path.join(__dirname, 'src', 'lib', 'signatureData.ts');

try {
    if (!fs.existsSync(signaturePath)) {
        console.error('Signature file not found at:', signaturePath);
        process.exit(1);
    }

    const buffer = fs.readFileSync(signaturePath);
    const base64 = buffer.toString('base64');
    const dataUrl = `data:image/png;base64,${base64}`;

    const content = `export const SIGNATURE_BASE64 = "${dataUrl}";\n`;

    // Ensure directory exists
    const dir = path.dirname(outputPath);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(outputPath, content);
    console.log('Successfully created signatureData.ts');

} catch (err) {
    console.error('Error:', err);
    process.exit(1);
}
