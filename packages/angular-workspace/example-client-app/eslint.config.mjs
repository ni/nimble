import { defineConfig, globalIgnores } from 'eslint/config';
import { lintNimbleConfig, javascriptNimbleConfig, angularTypescriptNimbleConfig, angularTemplateNimbleConfig } from '@ni-private/eslint-config-nimble';
import { resolve } from 'node:path';

export default defineConfig([
    globalIgnores(['**/src/environments']),
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
                project: ['./tsconfig.app.json', './tsconfig.spec.json'],
                tsconfigRootDir: import.meta.dirname,
            },
        },
        rules: {
            'no-restricted-imports': [
                'error',
                {
                    patterns: [
                        {
                            group: ['@ni/fast-*'],
                            message:
                                'Do not directly use underlying libraries of nimble. Instead rely on or add to exports of nimble packages.',
                        },
                        {
                            group: ['@ni/*-components'],
                            message:
                                'Client Angular applications should not directly depend on web component packages.',
                        },
                    ],
                },
            ],
            '@angular-eslint/component-selector': [
                'error',
                { type: 'element', prefix: 'example', style: 'kebab-case' },
            ],
            'jsdoc/require-jsdoc': 'off',
            'jsdoc/require-description': 'off',
        },
    },
    {
        files: ['**/*.html'],
        extends: angularTemplateNimbleConfig
    }
]);
