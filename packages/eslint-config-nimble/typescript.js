import { defineConfig } from 'eslint/config';
import { typescriptConfig } from '@ni/eslint-config-typescript';
import jsdoc from 'eslint-plugin-jsdoc';
import globals from 'globals';
import { javascriptNimbleConfigOverrides } from './javascript.js';

export const typescriptNimbleConfigOverrides = defineConfig([
    {
        plugins: {
            jsdoc,
        },
        rules: {
            // Require non-empty JSDoc comment on class declarations
            'jsdoc/require-jsdoc': [
                'error',
                {
                    publicOnly: false,
                    require: {
                        ClassDeclaration: true,
                        FunctionDeclaration: false,
                    },
                },
            ],
            'jsdoc/require-description': [
                'error',
                { contexts: ['ClassDeclaration'] },
            ]
        }
    },
    {
        files: ['**/*.spec.ts'],
        languageOptions: {
            globals: {
                ...globals.jasmine,
            },
        },
        rules: {
            // Classes defined in test code aren't part of the public API so don't need docs
            'jsdoc/require-jsdoc': 'off',
            'jsdoc/require-description': 'off',

            // test files will not be in published package and are allowed to use devDependencies
            'import/no-extraneous-dependencies': ['error', { devDependencies: true }],

            // It's common to define helper classes for tests and it's more readable to do this in the same file
            'max-classes-per-file': 'off',
        },
    }
]);

export const typescriptNimbleConfig = defineConfig([
    typescriptConfig,
    javascriptNimbleConfigOverrides,
    typescriptNimbleConfigOverrides,
]);
