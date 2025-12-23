import { defineConfig, globalIgnores } from 'eslint/config';
import { javascriptConfig, importNodeEsmConfig } from '@ni/eslint-config-javascript';
import markdownPreferences from 'eslint-plugin-markdown-preferences';
import markdownLinks from 'eslint-plugin-markdown-links';
import { resolve } from 'node:path';

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
    },
    globalIgnores(['CHANGELOG.md']),
    markdownPreferences.configs.recommended,
    markdownLinks.configs.recommended,
    {
        files: ['**/*.md', '*.md'],
        rules: {
            'markdown-links/no-missing-fragments': 'error',
            'markdown-links/no-missing-path': [
                'error',
                {
                    basePath: resolve(import.meta.dirname, '../../'),
                }
            ],
            'markdown-preferences/hard-linebreak-style': ['error', {
                style: 'spaces'
            }]
        },
    }
]);
