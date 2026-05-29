import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import { defineConfig, globalIgnores } from 'eslint/config';
import { javascriptConfig, importNodeEsmConfig } from '@ni/eslint-config-javascript';
import { lintNimbleConfig, typescriptNimbleConfig } from '@ni-private/eslint-config-nimble';

export default defineConfig([
    globalIgnores(['**/dist/']),
    lintNimbleConfig,
    {
        files: ['vite.config.mjs'],
        extends: [javascriptConfig, importNodeEsmConfig],
        rules: {
            // Configuration scripts will not be in published package and are allowed to use devDependencies
            'import/no-extraneous-dependencies': ['error', { devDependencies: true }],
            // Build scripts should give verbose logging
            'no-console': 'off',
            // Rollup config files use default exports
            'import/no-default-export': 'off',
        },
    },
    {
        files: ['**/*.ts', '**/*.tsx'],
        plugins: {
            react,
            'react-refresh': reactRefresh,
            'react-hooks': reactHooks,
        },
        extends: [
            typescriptNimbleConfig,
            react.configs.flat.recommended,
            react.configs.flat['jsx-runtime'],
            reactHooks.configs.flat.recommended,
        ],
        languageOptions: {
            parserOptions: {
                project: './tsconfig.json',
                tsconfigRootDir: import.meta.dirname,
                ecmaFeatures: {
                    jsx: true,
                },
            },
        },
        settings: {
            react: {
                version: 'detect'
            }
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
            'no-alert': 'off',
        },
    }
]);
