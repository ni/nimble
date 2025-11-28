const { defineConfig } = require('eslint/config');
const javascriptNimbleConfig = require('@ni-private/eslint-config-nimble/javascript');
const typescriptNimbleConfig = require('@ni-private/eslint-config-nimble/typescript');

module.exports = defineConfig([
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
                tsconfigRootDir: __dirname,
            },
        },
    },
    {
        files: ['**/vite.config.js', '**/eslint.config.cjs'],
        rules: {
            // Configuration scripts will not be in published package and are allowed to use devDependencies
            'import/no-extraneous-dependencies': ['error', { devDependencies: true }],
            'import/no-unresolved': 'off',
        },
    },
]);
