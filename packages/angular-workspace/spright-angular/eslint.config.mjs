import { defineConfig } from 'eslint/config';
import { lintNimbleConfig, javascriptNimbleConfig, angularTypescriptNimbleConfig, angularTemplateNimbleConfig } from '@ni-private/eslint-config-nimble';
import { resolve } from 'node:path';

export default defineConfig([
    lintNimbleConfig,
    {
        files: ['**/*.js', '**/*.cjs', '**/*.mjs'],
        extends: javascriptNimbleConfig,
        rules: {
            'import/no-extraneous-dependencies': ['error', { packageDir: resolve(import.meta.dirname, '../') }],
            'import/extensions': 'off'
        }
    },
    {
        files: ['**/*.ts'],
        extends: angularTypescriptNimbleConfig,
        languageOptions: {
            parserOptions: {
                project: ['./tsconfig.lib.json', './tsconfig.spec.json'],
                tsconfigRootDir: import.meta.dirname,
            },
        },
        rules: {
            'import/no-extraneous-dependencies': ['error', { packageDir: resolve(import.meta.dirname, '../') }],
        }
    },
    {
        files: ['**/*.html'],
        extends: angularTemplateNimbleConfig
    },
]);
