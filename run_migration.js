const { execSync } = require('child_process');
require('dotenv').config();

try {
    console.log('Running Prisma migration...');
    // Pass current process.env (which has loaded .env) to the child process
    execSync('node node_modules/prisma/build/index.js migrate dev --name add_cuotas_column', {
        stdio: 'inherit',
        env: process.env
    });
} catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
}
