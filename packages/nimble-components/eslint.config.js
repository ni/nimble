import { fileURLToPath } from 'url';
import path from 'path';
import { defineConfig } from 'eslint/config';
import { javascriptNimbleConfig } from '@ni-private/eslint-config-nimble/javascript';
import { componentsConfig } from '@ni-private/eslint-config-nimble/components';

const tsConfigRootDir = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig([
    {
        ignores: [
            'node_modules',
            '**/dist/**',
            '**/src/icons',
            '**/src/wafer-map/workers'
        ]
    },
    {
        files: ['**/*.js'],
        extends: javascriptNimbleConfig
    },
    {
        files: ['**/*.ts'],
        extends: componentsConfig,
        languageOptions: {
            parserOptions: {
                project: './tsconfig.json',
                tsConfigRootDir
            }
        },
        rules: {
            '@typescript-eslint/no-unnecessary-boolean-literal-compare': 'off',
            '@typescript-eslint/no-unnecessary-condition': 'off',
            '@typescript-eslint/strict-boolean-expressions': 'off',
            '@typescript-eslint/no-unused-vars': [
                'error',
                {
                    vars: 'all',
                    args: 'all',
                    argsIgnorePattern: '^_',
                    caughtErrorsIgnorePattern: '^_',
                    ignoreRestSiblings: true
                }
            ]
        }
    },
    {
        files: ['**/build/**/*.js'],
        rules: {
            // Build scripts should give verbose logging
            'no-console': 'off',
            // Rollup config files use default exports
            'import/no-default-export': 'off'
        }
    },
    {
        files: ['**/build/generate-workers/**/*.ts'],
        languageOptions: {
            parserOptions: {
                project: './build/generate-workers/tsconfig.json',
                tsConfigRootDir
            }
        },
        rules: {
            '@typescript-eslint/no-unnecessary-boolean-literal-compare': 'off',
            '@typescript-eslint/no-unnecessary-condition': 'off',
            '@typescript-eslint/strict-boolean-expressions': 'off'
        }
    }
]);
