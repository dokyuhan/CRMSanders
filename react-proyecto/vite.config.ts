import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';

export default defineConfig({
    plugins: [react()],
    define: {
        'process.env': process.env,
    },
    server: {
        host: true,
        https: {
          key: fs.readFileSync('../Cert/server.key', 'utf8'), // Directly reading the key file
          cert: fs.readFileSync('../Cert/server.crt', 'utf8'), // Directly reading the cert file
        }
    },
    base: './',
});