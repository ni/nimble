import { fileURLToPath } from 'url';
import path from 'path';
import { defineConfig } from 'eslint/config';
// eslint-disable-next-line import/extensions
import { configurations } from '../configurations.js';

const tsConfigRootDir = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig([
    configurations,
    {
        ignores: ['example-client-app/src/environments/**'],
    },
    {
        files: ['example-client-app/**/*.ts'],
        languageOptions: {
            parserOptions: {
                project: ['example-client-app/tsconfig.app.json', 'example-client-app/tsconfig.spec.json'],
                tsConfigRootDir,
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
]);
