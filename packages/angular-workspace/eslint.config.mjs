import { defineConfig, globalIgnores } from 'eslint/config';
import { lintNimbleConfig, javascriptNimbleConfig } from '@ni-private/eslint-config-nimble';

export default defineConfig([
    // ignore all subfolders as each project is configured separately
    globalIgnores(['*/']),
    lintNimbleConfig,
    {
        files: ['**/*.js', '**/*.cjs', '**/*.mjs'],
        extends: [javascriptNimbleConfig],
        rules: {
            'import/extensions': 'off'
        }
    },
]);
