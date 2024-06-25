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

        // Enabled to prevent accidental usage of async-await
        'require-await': 'off',
        '@typescript-eslint/require-await': 'error',
        'no-return-await': 'off',
        '@typescript-eslint/return-await': 'error',

        // Increasing the value of minProperties (default is 5?) so that eslint doesn't
        // introduce line breaks where prettier doesn't. If eslint introduces line breaks,
        // they will be unix-style, which will cause pointless diffs in git.
        'object-curly-newline': ['error', {
            multiline: true,
            consistent: true,
            minProperties: 1000
        }]
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
