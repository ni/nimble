import { fileURLToPath } from 'url';
import path from 'path';
import { defineConfig } from 'eslint/config';
// eslint-disable-next-line import/extensions, import/no-extraneous-dependencies
import { configurations } from '@ni-private/angular-workspace/configurations.js';

const tsConfigRootDir = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig([
    configurations,
    {
        ignores: ['nimble-angular/src/thirdparty/**'],
    },
    {
        files: ['nimble-angular/**/*.ts'],
        languageOptions: {
            parserOptions: {
                project: ['nimble-angular/tsconfig.lib.json', 'nimble-angular/tsconfig.spec.json'],
                tsConfigRootDir,
            }
        },
    },
    {
        files: ['nimble-angular/eslint.config.js'],
        rules: {
            'import/no-default-export': 'off',
        },
    },
    {
        files: ['nimble-angular/build/**/*.js'],
        rules: {
            // Logging in build scripts is useful
            'no-console': 'off',
            // Rollup config files use default exports
            'import/no-default-export': 'off',
        },
    },
]);
