const { defineConfig } = require('eslint/config');
const baseConfig = require('../eslint.config.js');

module.exports = defineConfig([
    baseConfig,
    {
        ignores: ['**/src/thirdparty'],
    },
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
    },
    {
        files: ['**/build/**/*.js'],
        rules: {
        // Logging in build scripts is useful
            'no-console': 'off',
            // Rollup config files use default exports
            'import/no-default-export': 'off'
        }
    }
]);
