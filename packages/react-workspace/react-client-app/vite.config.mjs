import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

export default defineConfig({
    plugins: [react()],
    base: './',
    build: {
        chunkSizeWarningLimit: 5 * 1024 * 1024
    }
});
