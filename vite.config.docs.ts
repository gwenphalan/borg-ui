import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';
import { resolve } from 'path';

export default defineConfig({
    appType: 'spa',
    plugins: [
        react(),
        svgr({
            svgrOptions: {
                icon: true,
                svgo: true,
                replaceAttrValues: {
                    '#000000': 'currentColor',
                    '#000': 'currentColor',
                    black: 'currentColor',
                },
            },
        }),
    ],
    define: {
        global: 'window',
    },
    build: {
        outDir: 'dist-docs', // Output to a different directory
        sourcemap: true,
        minify: true,
    },
    resolve: {
        alias: {
            '@': resolve(__dirname, './src'),
            buffer: 'buffer',
        },
    },
    publicDir: 'public',
}); 