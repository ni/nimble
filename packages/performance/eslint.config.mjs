import { defineConfig, globalIgnores } from 'eslint/config';
import { importNodeEsmConfig } from '@ni/eslint-config-javascript';
import { lintNimbleConfig, javascriptNimbleConfig, typescriptNimbleConfig } from '@ni-private/eslint-config-nimble';

export default defineConfig([
    globalIgnores(['**/dist/']),
    lintNimbleConfig,
    {
        files: ['**/*.js', '**/*.cjs'],
        extends: javascriptNimbleConfig,
    },
    {
        files: ['**/*.ts'],
        extends: typescriptNimbleConfig,
        languageOptions: {
            parserOptions: {
                project: './tsconfig.json',
                tsconfigRootDir: import.meta.dirname,
            },
        },
    },
    {
        files: ['**/vite.config.js'],
        extends: importNodeEsmConfig,
        rules: {
            // Vite config tends to rely on default exports in plugins
            'import/no-default-export': 'off',

            // Vite config is not a published package and is allowed to use devDependencies
            'import/no-extraneous-dependencies': [
                'error',
                { devDependencies: true }
            ]
        }
    },
]);
