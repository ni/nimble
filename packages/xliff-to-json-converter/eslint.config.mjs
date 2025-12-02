import { defineConfig } from 'eslint/config';
import { javascriptNimbleConfig, typescriptNimbleConfig, lintNimbleConfig } from '@ni-private/eslint-config-nimble';

export default defineConfig([
    {
        ignores: ['**/dist/**'],
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
                tsconfigRootDir: import.meta.dirname,
            },
        },
        rules: {
            // This is a command line app so printing to console to show progress is desirable
            'no-console': 'off',
        },
    },
    {
        files: ['**/*.mjs'],
        extends: lintNimbleConfig
    },
]);
