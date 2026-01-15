import * as path from 'node:path';
import { createRequire } from 'node:module';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

const require = createRequire(import.meta.url);

export default defineConfig({
    plugins: [react()],
    base: './',
    build: {
        chunkSizeWarningLimit: 5 * 1024 * 1024
    },

    // Used for improved nimble dev workflow, not needed in normal apps
    // Keep in sync with typescript.json
    resolve: {
        alias: [
            {
                find: /^@ni\/nimble-react\/styles\/(.*)/,
                replacement: `${getAbsolutePath('@ni/nimble-react')}/styles/$1.scss`
            },
            {
                find: /^@ni\/nimble-react\/icons\/(.*)/,
                replacement: `${getAbsolutePath('@ni/nimble-react')}/src/icons/$1.ts`
            },
            {
                find: /^@ni\/nimble-react\/(.*)/,
                replacement: `${getAbsolutePath('@ni/nimble-react')}/src/$1/index.ts`
            },
            {
                find: /^@ni\/spright-react\/(.*)/,
                replacement: `${getAbsolutePath('@ni/spright-react')}/src/$1/index.ts`
            },
            {
                find: /^@ni\/ok-react\/(.*)/,
                replacement: `${getAbsolutePath('@ni/ok-react')}/src/$1/index.ts`
            },
        ]
    }
});

function getAbsolutePath(value) {
    return path.dirname(require.resolve(path.join(value, 'package.json')));
}
