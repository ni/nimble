import { defineConfig } from 'eslint/config';
import { javascriptNimbleConfig, componentsNimbleConfig } from '@ni-private/eslint-config-nimble';

export default defineConfig([
    {
        ignores: ['**/dist/**', '**/src/icons', '**/src/wafer-map/workers']
    },
    {
        files: ['**/*.js'],
        extends: javascriptNimbleConfig
    },
    {
        files: ['**/*.ts'],
        extends: componentsNimbleConfig,
        languageOptions: {
            parserOptions: {
                project: './tsconfig.json',
                tsconfigRootDir: import.meta.dirname
            }
        },
        rules: {
            // Disable strict null checks
            '@typescript-eslint/no-unnecessary-condition': 'off',
            '@typescript-eslint/strict-boolean-expressions': 'off',
            '@typescript-eslint/no-unnecessary-boolean-literal-compare': 'off'
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
                tsconfigRootDir: import.meta.dirname
            }
        }
    }
]);
