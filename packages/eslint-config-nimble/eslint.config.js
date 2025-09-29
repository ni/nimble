import { defineConfig } from 'eslint/config';
import { javascriptNimbleConfig } from './javascript.js';

export default defineConfig([
    {
        ignores: ['node_modules'],
    },
    {
        files: ['**/*.js'],
        extends: [...javascriptNimbleConfig],
    },
    {
        files: ['eslint.config.js'],
        rules: {
            'import/no-default-export': 'off',
            'import/extensions': 'off',
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
