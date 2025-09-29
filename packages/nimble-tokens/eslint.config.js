import { defineConfig } from 'eslint/config';
import { javascriptNimbleConfig } from '@ni-private/eslint-config-nimble/javascript';

export default defineConfig([
    {
        ignores: ['node_modules', 'dist', 'dist/styledictionary/*'],
    },
    {
        files: ['**/*.js', '**/*.cjs'],
        extends: [...javascriptNimbleConfig],
    },
    {
        files: ['**/*.js'],
        rules: {
            'import/extensions': [
                'error',
                'always',
                {
                    ignorePackages: true,
                },
            ],
            'import/no-unresolved': [
                'error',
                {
                    ignore: ['^style-dictionary$'],
                },
            ],
        },
    },
    {
        files: ['/source/styledictionary/*.cjs'],
        rules: {
            // Build scripts will not be in published package and are allowed to use devDependencies
            'import/no-extraneous-dependencies': ['error', { devDependencies: true }],

            // Okay to use console.log in build scripts
            'no-console': 'off',
        },
    },
    {
        files: ['**/build/**'],
        rules: {
            // Build scripts will not be in published package and are allowed to use devDependencies
            'import/no-extraneous-dependencies': ['error', { devDependencies: true }],

            // Okay to use console.log in build scripts
            'no-console': 'off',
        },
    },
    {
        files: ['eslint.config.js'],
        rules: {
            'import/no-default-export': 'off',
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
