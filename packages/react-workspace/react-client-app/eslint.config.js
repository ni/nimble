import path from 'path';
import { fileURLToPath } from 'url';
import { defineConfig } from 'eslint/config';
import { javascriptNimbleConfig } from '@ni-private/eslint-config-nimble/javascript';
import { typescriptNimbleConfig } from '@ni-private/eslint-config-nimble/typescript';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';

const tsConfigRootDir = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig([
    {
        ignores: ['node_modules', 'dist'],
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
        extends: [
            ...typescriptNimbleConfig,
            reactHooks.configs['recommended-latest'],
        ],
        plugins: {
            'react-refresh': reactRefresh,
        },
        languageOptions: {
            parserOptions: {
                project: './tsconfig.app.json',
                tsConfigRootDir,
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
            '@typescript-eslint/no-unnecessary-boolean-literal-compare': 'off',
            '@typescript-eslint/no-unnecessary-condition': 'off',
            '@typescript-eslint/strict-boolean-expressions': 'off',
        },
    },
    {
        files: ['./vite.config.ts'],
        languageOptions: {
            parserOptions: {
                project: './tsconfig.node.json',
                tsConfigRootDir,
            },
        },
        rules: {
            // Configuration scripts will not be in published package and are allowed to use devDependencies
            'import/no-extraneous-dependencies': ['error', { devDependencies: true }],
            'import/no-default-export': 'off',
        },
    }
]);
