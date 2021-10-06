module.exports = {
    root: true,
    plugins: ['jsdoc'],
    extends: [
        '@ni/eslint-config-typescript',
        '@ni/eslint-config-typescript/requiring-type-checking'
    ],
    parserOptions: {
        project: '../tsconfig.json',
        tsconfigRootDir: __dirname
    },
    rules: {
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

        // *-default-export lines can be deleted once a fix for this issue is published and uptaken
        // https://github.com/ni/javascript-styleguide/issues/39
        'import/prefer-default-export': 'off',
        'import/no-default-export': 'error',

        // Rules enabled due to strictNullChecks
        '@typescript-eslint/no-non-null-assertion': 'off',

        'no-restricted-imports': [
            'error',
            {
                paths: [
                    {
                        name: '@microsoft/fast-foundation',
                        importNames: ['focusVisible'],
                        message:
                            'Please use focusVisible from src/utilities/style/focus instead.'
                    }
                ]
            }
        ]
    },
    ignorePatterns: ['.eslintrc.js'],
    overrides: [
        {
            files: ['*.stories.ts'],
            rules: {
                // Storybook files will not be in published package and are allowed to use devDependencies
                'import/no-extraneous-dependencies': [
                    'error',
                    { devDependencies: true }
                ],
                'import/no-default-export': 'off'
            }
        },
        {
            files: ['*.spec.ts'],
            env: {
                jasmine: true
            },
            rules: {
                // Classes defined in test code aren't part of the public API so don't need docs
                'jsdoc/require-jsdoc': 'off'
            }
        },
        {
            files: ['styles.ts'],
            rules: {
                // template literals are also used to comment on the css and
                // the comments should be intended accordingly
                '@typescript-eslint/indent': [
                    'error',
                    4,
                    { ignoredNodes: ['TemplateLiteral'] }
                ]
            }
        }
    ]
};
