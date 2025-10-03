const { defineConfig } = require('eslint/config');
const baseConfig = require('../eslint.config.js');

module.exports = defineConfig([
    baseConfig,
    {
        ignores: ['**/src/environments'],
    },
    {
        files: ['**/*.ts'],
        languageOptions: {
            parserOptions: {
                project: [
                    './tsconfig.app.json',
                    './tsconfig.spec.json'
                ],
                tsconfigRootDir: __dirname
            },
        },
        rules: {
            'no-restricted-imports': ['error', {
                patterns:
            [{
                group: ['@ni/fast-*'],
                message: 'Do not directly use underlying libraries of nimble. Instead rely on or add to exports of nimble packages.'
            },
            {
                group: ['@ni/*-components'],
                message: 'Client Angular applications should not directly depend on web component packages.'
            }]
            }],
            '@angular-eslint/component-selector': [
                'error',
                { type: 'element', prefix: 'example', style: 'kebab-case' }
            ],
            'jsdoc/require-jsdoc': 'off',
            'jsdoc/require-description': 'off'
        }
    }
]);
