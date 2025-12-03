import { defineConfig } from 'eslint/config';
import { javascriptConfig, importNodeEsmConfig } from '@ni/eslint-config-javascript';

export const lintNimbleConfig = defineConfig([
    {
        files: [
            '**/eslint.config.cjs',
            '**/eslint.config.cts',
            '**/eslint.config.js',
            '**/eslint.config.mjs',
            '**/eslint.config.mts',
            '**/eslint.config.ts'
        ],
        extends: [javascriptConfig, importNodeEsmConfig],
        // Ignoring imports in each specific project eslint config
        // so each package.json does not need explicit `eslint`
        // and `eslint-config-nimble` dependencies.
        rules: {
            'import/no-extraneous-dependencies': 'off'
        }
    }
]);
