import { defineConfig, globalIgnores } from 'eslint/config';
import { javascriptConfig, importNodeEsmConfig } from '@ni/eslint-config-javascript';
import { lintNimbleConfig, typescriptNimbleConfig } from '@ni-private/eslint-config-nimble';

export default defineConfig([
    globalIgnores(['**/dist/']),
    lintNimbleConfig,
    {
        files: ['build/**/*.mjs'],
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
        files: ['**/*.ts'],
        extends: typescriptNimbleConfig,
        languageOptions: {
            parserOptions: {
                project: './tsconfig.json',
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
        },
    },
]);
