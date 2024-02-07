// eslint-disable-next-line import/no-extraneous-dependencies
import { defineConfig } from 'vite';
import { resolve } from 'path';

// eslint-disable-next-line import/no-default-export
export default defineConfig({
    base: './',
    build: {
        outDir: '../dist/',
        emptyOutDir: true,
        rollupOptions: {
            input: {
                main: resolve(__dirname, './index.html'),
                'wafer-map': resolve(__dirname, './wafer-map/index.html')
            }
        }
    }
});
