// eslint-disable-next-line import/no-unresolved
const { defineConfig } = require('eslint/config');

const javascriptNimbleConfig = require('@ni-private/eslint-config-nimble/javascript');

module.exports = defineConfig([
    {
        ignores: ['**/dist', '**/dist/styledictionary/*'],
    },
    {
        files: ['**/*.js', '**/*.cjs'],
        extends: javascriptNimbleConfig,
    },
    {
        files: ['**/*.js'],
        rules: {
            'import/extensions': [
                'error',
                'always',
                {
                    ignorePackages: true,
                },
            ],
            'import/no-unresolved': [
                'error',
                {
                    ignore: ['^style-dictionary$'],
                },
            ],
        },
    },
    {
        files: ['**/source/styledictionary/*.cjs'],
        rules: {
            // Build scripts will not be in published package and are allowed to use devDependencies
            'import/no-extraneous-dependencies': ['error', { devDependencies: true }],

            // Okay to use console.log in build scripts
            'no-console': 'off',
        },
    },
    {
        files: ['**/build/**'],
        rules: {
            // Build scripts will not be in published package and are allowed to use devDependencies
            'import/no-extraneous-dependencies': ['error', { devDependencies: true }],

            // Okay to use console.log in build scripts
            'no-console': 'off',
        },
    },
]);
