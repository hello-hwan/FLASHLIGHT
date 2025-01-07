import { fileURLToPath, URL } from 'node:url';

import { PrimeVueResolver } from '@primevue/auto-import-resolver';
import vue from '@vitejs/plugin-vue';
import Components from 'unplugin-vue-components/vite';
import { defineConfig } from 'vite';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
    build: {
        outDir: path.resolve("../server/public"),
        emptyOutDir: true, // also necessary
    },
    optimizeDeps: {
        noDiscovery: true,
        include: ['jspdf', 'jspdf-autotable']
            //pdf autotable생성을 위함
    },
    plugins: [
        vue(),
        Components({
            resolvers: [PrimeVueResolver()]
        })
    ],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url))
        }
    },
    server: {
        proxy: {
            '^/api': {
                target: 'http://localhost:3000',
                changeOrigin: true,
            }
        }
    }
});
