import path from 'path';
import { fileURLToPath } from 'url';
import { defineConfig } from 'eslint/config';
import { javascriptNimbleConfig } from '@ni-private/eslint-config-nimble/javascript';
import { typescriptNimbleConfig } from '@ni-private/eslint-config-nimble/typescript';

const tsConfigRootDir = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig([
    {
        ignores: [
            'node_modules',
            '**/dist',
            // Force inclusion of config dot file
            '!.eleventy.js',
        ],
    },
    {
        files: ['**/*.js'],
        extends: javascriptNimbleConfig,
    },
    {
        files: ['**/*.ts'],
        extends: typescriptNimbleConfig,
        languageOptions: {
            parserOptions: {
                project: ['./tsconfig.json'],
                tsConfigRootDir,
            },
        },
    }
]);
