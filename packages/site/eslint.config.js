const { defineConfig } = require('eslint/config');
const javascriptNimbleConfig = require('@ni-private/eslint-config-nimble/javascript');
const typescriptNimbleConfig = require('@ni-private/eslint-config-nimble/typescript');

module.exports = defineConfig([
    {
        ignores: [
            'node_modules',
            '**/dist/**',
            // Force inclusion of config dot file
            '!**/*.eleventy.js',
        ],
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
                project: ['./tsconfig.json'],
                tsconfigRootDir: __dirname,
            },
        },
    },
]);
