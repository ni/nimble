import path from 'path';
import { fileURLToPath } from 'url';
import { defineConfig } from 'eslint/config';
import { javascriptNimbleConfig } from '@ni-private/eslint-config-nimble/javascript';
import { typescriptNimbleConfig } from '@ni-private/eslint-config-nimble/typescript';

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
        files: ['**/*.ts'],
        extends: typescriptNimbleConfig,
        languageOptions: {
            parserOptions: {
                project: 'tsconfig.json',
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
        },
    }
]);
