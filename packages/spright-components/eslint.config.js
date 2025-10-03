const { defineConfig } = require('eslint/config');
const javascriptNimbleConfig = require('@ni-private/eslint-config-nimble/javascript');
const componentsNimbleConfig = require('@ni-private/eslint-config-nimble/components');

module.exports = defineConfig([
    {
        ignores: ['node_modules', '**/dist/**']
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
        },
        rules: {
            // Disable strict null checks
            '@typescript-eslint/no-unnecessary-condition': 'off',
            '@typescript-eslint/strict-boolean-expressions': 'off',
            '@typescript-eslint/no-unnecessary-boolean-literal-compare': 'off'
        }
    }
]);
