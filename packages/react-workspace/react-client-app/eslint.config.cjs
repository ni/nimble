const { defineConfig } = require('eslint/config');
const javascriptNimbleConfig = require('@ni-private/eslint-config-nimble/javascript');
const typescriptNimbleConfig = require('@ni-private/eslint-config-nimble/typescript');
const reactHooks = require('eslint-plugin-react-hooks');
const reactRefresh = require('eslint-plugin-react-refresh');

module.exports = defineConfig([
    {
        ignores: ['**/dist/**'],
    },
    {
        files: ['**/*.js', '**/*.cjs'],
        extends: javascriptNimbleConfig,
        rules: {
            // Configuration scripts will not be in published package and are allowed to use devDependencies
            'import/no-extraneous-dependencies': ['error', { devDependencies: true }],
        },
    },
    {
        files: ['**/*.ts', '**/*.tsx'],
        plugins: {
            'react-refresh': reactRefresh,
            'react-hooks': reactHooks
        },
        extends: [
            ...typescriptNimbleConfig,
            reactHooks.configs.flat.recommended,
        ],
        languageOptions: {
            parserOptions: {
                project: './tsconfig.app.json',
                tsconfigRootDir: __dirname,
            },
        },
        rules: {
            // The React components should use PascalCase
            '@typescript-eslint/naming-convention': [
                'error',
                {
                    selector: 'variable',
                    format: ['camelCase', 'PascalCase'],
                },
            ],
            'react-refresh/only-export-components': [
                'error',
                { allowConstantExport: true },
            ],
            '@typescript-eslint/strict-boolean-expressions': 'off',
        },
    },
    {
        files: ['**/vite.config.ts'],
        languageOptions: {
            parserOptions: {
                project: './tsconfig.node.json',
                tsconfigRootDir: __dirname,
            },
        },
        rules: {
            // Configuration scripts will not be in published package and are allowed to use devDependencies
            'import/no-extraneous-dependencies': ['error', { devDependencies: true }],
            'import/no-default-export': 'off',
        },
    },
    {
        files: ['**/eslint.config.cjs'],
        rules: {
            'import/no-unresolved': 'off',
            'import/no-extraneous-dependencies': 'off',
        },
    },
]);
