import { defineConfig, globalIgnores } from 'eslint/config';
import { lintNimbleConfig, componentsNimbleConfig, javascriptNimbleConfig } from '@ni-private/eslint-config-nimble';

export default defineConfig([
    globalIgnores([
        '**/dist/',
        '**/src/icons/',
        '**/src/wafer-map/workers/'
    ]),
    lintNimbleConfig,
    {
        files: ['**/*.js', '**/*.cjs', '**/*.mjs'],
        extends: [javascriptNimbleConfig],
        rules: {
            'import/extensions': 'off'
        }
    },
    {
        files: ['**/*.ts'],
        extends: componentsNimbleConfig,
        languageOptions: {
            parserOptions: {
                project: './tsconfig.json',
                tsconfigRootDir: import.meta.dirname
            }
        }
    },
    {
        files: ['**/build/**/*.js', '**/build/**/*.cjs', '**/build/**/*.mjs'],
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
