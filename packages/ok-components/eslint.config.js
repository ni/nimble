const { defineConfig } = require('eslint/config');
const javascriptNimbleConfig = require('@ni-private/eslint-config-nimble/javascript');
const componentsNimbleConfig = require('@ni-private/eslint-config-nimble/components');

module.exports = defineConfig([
    {
        ignores: ['**/dist/**']
    },
    {
        files: ['**/*.js'],
        extends: javascriptNimbleConfig
    },
    {
        files: ['**/*.ts'],
        extends: componentsNimbleConfig,
        languageOptions: {
            parserOptions: {
                project: './tsconfig.json',
                tsconfigRootDir: __dirname
            }
        }
    }
]);
