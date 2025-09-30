import path from 'path';
import { fileURLToPath } from 'url';
import { defineConfig } from 'eslint/config';
import { javascriptNimbleConfig } from '@ni-private/eslint-config-nimble/javascript';
import { typescriptNimbleConfig } from '@ni-private/eslint-config-nimble/typescript';

const tsConfigRootDir = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig([
    {
        ignores: ['node_modules', '**/dist/**'],
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
                project: './tsconfig.json',
                tsConfigRootDir,
            },
        },
        rules: {
            // This is a command line app so printing to console to show progress is desirable
            'no-console': 'off',
        },
    }
]);
