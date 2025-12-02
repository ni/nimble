import { defineConfig } from 'eslint/config';
import { javascriptNimbleConfig, typescriptNimbleConfig} from '@ni-private/eslint-config-nimble';


export default defineConfig([
    {
        ignores: ['**/dist/**'],
    },
    {
        files: ['**/*.js', '**/*.cjs'],
        extends: javascriptNimbleConfig,
        rules: {
            // Configuration scripts will not be in published package and are allowed to use devDependencies
            'import/no-extraneous-dependencies': ['error', { devDependencies: true }]
        },
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
]);
