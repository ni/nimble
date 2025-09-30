import path from 'path';
import { fileURLToPath } from 'url';
import { defineConfig } from 'eslint/config';
import { javascriptNimbleConfig } from '@ni-private/eslint-config-nimble/javascript';
import { componentsConfig } from '@ni-private/eslint-config-nimble/components';

const tsConfigRootDir = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig([
    {
        ignores: ['node_modules', 'dist']
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
            '@typescript-eslint/strict-boolean-expressions': 'off'
        }
    }
]);
