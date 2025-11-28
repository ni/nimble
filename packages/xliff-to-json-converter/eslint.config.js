const { defineConfig } = require('eslint/config');
const javascriptNimbleConfig = require('@ni-private/eslint-config-nimble/javascript');
const typescriptNimbleConfig = require('@ni-private/eslint-config-nimble/typescript');

module.exports = defineConfig([
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
                tsconfigRootDir: __dirname,
            },
        },
        rules: {
            // This is a command line app so printing to console to show progress is desirable
            'no-console': 'off',
        },
    },
]);
