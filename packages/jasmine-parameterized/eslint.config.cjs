// eslint-disable-next-line import/no-unresolved
const { defineConfig } = require('eslint/config');
const javascriptNimbleConfig = require('@ni-private/eslint-config-nimble/javascript');
const typescriptNimbleConfig = require('@ni-private/eslint-config-nimble/typescript');

module.exports = defineConfig([
    {
        ignores: ['**/dist/**'],
    },
    {
        files: ['*.js', '*.cjs'],
        extends: javascriptNimbleConfig,
        rules: {
            // Configuration scripts will not be in published package and are allowed to use devDependencies
            'import/no-extraneous-dependencies': ['error', { devDependencies: true }],
        },
    },
    {
        files: ['*.ts'],
        extends: typescriptNimbleConfig,
        parserOptions: {
            project: './tsconfig.json',
            tsconfigRootDir: __dirname,
        },
    },
]);
