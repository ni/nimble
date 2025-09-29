import { fileURLToPath } from 'url';
import path from 'path';
// eslint-disable-next-line import/extensions
import configurations from '../configurations.js';

const tsConfigRootDir = path.dirname(fileURLToPath(import.meta.url));

export default [
    ...configurations,
    {
        ignores: ['src/environments/**'],
    },
    {
        files: ['eslint.config.js'],
        rules: {
            'import/no-default-export': 'off'
        }
    },
    {
        files: ['**/*.ts'],
        languageOptions: {
            parserOptions: {
                project: ['../tsconfig.app.json', '../tsconfig.spec.json'],
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
];
