import path from 'path';
import { fileURLToPath } from 'url';
import { defineConfig } from 'eslint/config';
import { javascriptNimbleConfig } from '@ni-private/eslint-config-nimble/javascript';
import { typescriptNimbleConfig } from '@ni-private/eslint-config-nimble/typescript';

const tsConfigRootDir = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig([
    {
        ignores: [
            'node_modules',
            '**/dist',
            // Force inclusion of config dot file
            '!.eleventy.js',
        ],
    },
    {
        files: ['**/*.js'],
        extends: [...javascriptNimbleConfig],
    },
    {
        files: ['**/*.ts'],
        extends: [...typescriptNimbleConfig],
        languageOptions: {
            parserOptions: {
                project: ['./tsconfig.json'],
                tsConfigRootDir,
            },
        },
    },
    {
        files: ['eslint.config.js'],
        rules: {
            'import/no-default-export': 'off',
            // eslint-plugin-import doesn't know how to resolve entry points in packages
            // that use modern export maps in package.json.
            // https://github.com/typescript-eslint/typescript-eslint/issues/7565
            // https://github.com/import-js/eslint-plugin-import/issues/2703
            'import/no-unresolved': [
                'error',
                {
                    ignore: ['eslint/config'],
                },
            ],
        },
    },
]);
