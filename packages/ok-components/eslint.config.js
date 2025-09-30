import { javascriptNimbleConfig } from '@ni-private/eslint-config-nimble/javascript';
import { componentsConfig } from '@ni-private/eslint-config-nimble/components';
import { defineConfig } from 'eslint/config';
import path from 'path';
import { fileURLToPath } from 'url';

const tsConfigRootDir = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig([
    {
        ignores: ['node_modules', '**/dist/**']
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
        }
    }
]);
