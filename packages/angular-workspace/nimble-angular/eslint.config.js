import { fileURLToPath } from 'url';
import path from 'path';
// eslint-disable-next-line import/no-extraneous-dependencies, import/extensions
import configurations from '@ni-private/angular-workspace/configurations.js';

const tsConfigRootDir = path.dirname(fileURLToPath(import.meta.url));

export default [
    ...configurations,
    {
        ignores: ['**/src/thirdparty/**', '**/build/**'],
    },
    {
        files: ['**/*.ts'],
        languageOptions: {
            parserOptions: {
                project: ['./tsconfig.lib.json', './tsconfig.spec.json'],
                tsConfigRootDir,
            }
        },
    },
    {
        files: ['eslint.config.js'],
        rules: {
            'import/no-default-export': 'off',
        },
    },
    {
        files: ['**/build/**/*.js'],
        rules: {
            // Logging in build scripts is useful
            'no-console': 'off',
            // Rollup config files use default exports
            'import/no-default-export': 'off',
        },
    },
];
