import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import { defineConfig, globalIgnores } from 'eslint/config';
import { lintNimbleConfig, javascriptNimbleConfig, typescriptNimbleConfig } from '@ni-private/eslint-config-nimble';

export default defineConfig([
    globalIgnores(['**/dist/']),
    lintNimbleConfig,
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
            typescriptNimbleConfig,
            reactHooks.configs.flat.recommended,
        ],
        languageOptions: {
            parserOptions: {
                project: './tsconfig.app.json',
                tsconfigRootDir: import.meta.dirname,
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
            'no-alert': 'off'
        },
    },
    {
        files: ['**/vite.config.ts'],
        languageOptions: {
            parserOptions: {
                project: './tsconfig.node.json',
                tsconfigRootDir: import.meta.dirname,
            },
        },
        rules: {
            // Configuration scripts will not be in published package and are allowed to use devDependencies
            'import/no-extraneous-dependencies': ['error', { devDependencies: true }],
            'import/no-default-export': 'off',
        },
    }
]);
