import { defineConfig } from 'eslint/config';
import { lintNimbleConfig, javascriptNimbleConfig, angularTypescriptNimbleConfig, angularTemplateNimbleConfig } from '@ni-private/eslint-config-nimble';
import { resolve } from 'node:path';

export default defineConfig([
    lintNimbleConfig,
    {
        files: ['**/*.js'],
        extends: javascriptNimbleConfig,
        rules: {
            'import/no-extraneous-dependencies': ['error', { packageDir: resolve(import.meta.dirname, '../') }],
        }
    },
    {
        files: ['**/*.ts'],
        languageOptions: {
            parserOptions: {
                project: ['./tsconfig.lib.json', './tsconfig.spec.json'],
                tsconfigRootDir: import.meta.dirname,
            },
        },
        extends: angularTypescriptNimbleConfig,
        rules: {
            'import/no-extraneous-dependencies': ['error', { packageDir: resolve(import.meta.dirname, '../') }],
        }
    },
    {
        files: ['**/*.html'],
        extends: angularTemplateNimbleConfig
    },
]);
