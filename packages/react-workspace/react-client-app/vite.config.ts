import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

// https://vite.dev/config/
export default defineConfig({
    plugins: [react()],
    base: './',
    resolve: {
        alias: [
            {
                find: '@ni/nimble-react/dist/esm',
                replacement: '@ni/nimble-react/src'
            },
            {
                find: '@ni/spright-react/dist/esm',
                replacement: '@ni/spright-react/src'
            },
            {
                find: '@ni/ok-react/dist/esm',
                replacement: '@ni/ok-react/src'
            },
        ]
    }
});
