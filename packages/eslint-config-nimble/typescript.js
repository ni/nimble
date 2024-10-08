module.exports = {
    extends: [
        '@ni/eslint-config-typescript',
        '@ni/eslint-config-typescript/requiring-type-checking'
    ],
    parserOptions: {
        ecmaVersion: 2020
    },
    plugins: ['jsdoc'],
    rules: {
        // Require non-empty JSDoc comment on class declarations
        'jsdoc/require-jsdoc': [
            'error',
            {
                publicOnly: false,
                require: {
                    ClassDeclaration: true,
                    FunctionDeclaration: false
                }
            }
        ],
        'jsdoc/require-description': [
            'error',
            { contexts: ['ClassDeclaration'] }
        ],

        // Rules enabled due to strictNullChecks
        // see: https://github.com/ni/javascript-styleguide/#strict-null-checks
        '@typescript-eslint/no-non-null-assertion': 'off',

        // This rule's configuration is based on the NI javascript styleguide:
        // https://github.com/ni/javascript-styleguide/blob/a1a6abd7adca7d9acd002705101b351d695b2442/packages/eslint-config-javascript/index.js
        // The only difference is that we're increasing the value of minProperties (from 6) so
        // that eslint doesn't introduce line breaks where prettier doesn't. If eslint introduces
        // line breaks, they will be unix-style, which will cause pointless diffs in git.
        'object-curly-newline': ['error', {
            ObjectExpression: { minProperties: 1000, multiline: true, consistent: true },
            ObjectPattern: { minProperties: 1000, multiline: true, consistent: true },
            ImportDeclaration: { consistent: true },
            ExportDeclaration: { consistent: true }
        }],
    },
    overrides: [
        {
            files: ['*.spec.ts'],
            env: {
                jasmine: true
            },
            rules: {
                // Classes defined in test code aren't part of the public API so don't need docs
                'jsdoc/require-jsdoc': 'off',
                'jsdoc/require-description': 'off',

                // test files will not be in published package and are allowed to use devDependencies
                'import/no-extraneous-dependencies': [
                    'error',
                    { devDependencies: true }
                ],

                // It's common to define helper classes for tests and it's more readable to do this in the same file
                'max-classes-per-file': 'off'
            }
        }
    ]
};
