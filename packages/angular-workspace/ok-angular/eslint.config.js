import { fileURLToPath } from 'url';
import path from 'path';
// eslint-disable-next-line import/no-extraneous-dependencies, import/extensions
import { configurations } from '@ni-private/angular-workspace/configurations.js';

const tsConfigRootDir = path.dirname(fileURLToPath(import.meta.url));

// eslint-disable-next-line import/no-default-export
export default [
    ...configurations,
    {
        files: ['ok-angular/**/*.ts'],
        languageOptions: {
            parserOptions: {
                project: [
                    'ok-angular/tsconfig.lib.json',
                    'ok-angular/tsconfig.spec.json'
                ],
                tsConfigRootDir
            }
        }
    }
];
