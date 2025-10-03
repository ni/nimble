const { defineConfig } = require('eslint/config');
const baseConfig = require('../eslint.config.js');

module.exports = defineConfig([
    baseConfig,
    {
        files: ['**/*.ts'],
        languageOptions: {
            parserOptions: {
                project: [
                    './tsconfig.lib.json',
                    './tsconfig.spec.json'
                ],
                tsconfigRootDir: __dirname
            }
        }
    }
]);
