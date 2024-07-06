import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
    build: {
        rollupOptions: {
            output: {
                chunkFileNames: `[name]-[hash].js`,
                entryFileNames: `[name]-[hash].js`,
                assetFileNames: `[name]-[hash].[ext]`,
            },
        },
    },
    plugins: [react()],
});
