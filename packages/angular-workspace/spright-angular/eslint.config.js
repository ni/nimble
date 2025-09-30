import { fileURLToPath } from 'url';
import path from 'path';
// eslint-disable-next-line import/no-extraneous-dependencies, import/extensions
import { configurations } from '@ni-private/angular-workspace/configurations.js';
import { defineConfig } from 'eslint/config';

const tsConfigRootDir = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig([
    configurations,
    {
        files: ['spright-angular/**/*.ts'],
        languageOptions: {
            parserOptions: {
                project: [
                    'spright-angular/tsconfig.lib.json',
                    'spright-angular/tsconfig.spec.json'
                ],
                tsConfigRootDir
            }
        }
    }
]);
