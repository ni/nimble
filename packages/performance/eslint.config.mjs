import { defineConfig } from 'eslint/config';
import { javascriptNimbleConfig, lintNimbleConfig, typescriptNimbleConfig } from '@ni-private/eslint-config-nimble';

export default defineConfig([
    {
        ignores: ['**/dist/**'],
    },
    {
        files: ['**/*.js', '**/*.cjs'],
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
    },
    {
        files: ['**/vite.config.js', '**/eslint.config.mjs'],
        extends: [lintNimbleConfig]
    },
]);
