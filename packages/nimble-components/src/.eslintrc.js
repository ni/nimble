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
        '@typescript-eslint/no-non-null-assertion': 'off',

        // Improves readability of templates to avoid return types in template expressions
        '@typescript-eslint/explicit-function-return-type': [
            'error',
            { allowExpressions: true }
        ],

        'no-restricted-imports': [
            'error',
            {
                paths: [
                    {
                        name: '@microsoft/fast-foundation',
                        importNames: ['focusVisible'],
                        message:
                            'Please use focusVisible from src/utilities/style/focus instead.'
                    },
                    {
                        name: '@microsoft/fast-components',
                        message:
                            'It is not expected to leverage @microsoft/fast-components directly as they are coupled to FAST design tokens.'
                    }
                ]
            }
        ]
    },
    ignorePatterns: ['.eslintrc.js'],
    overrides: [
        {
            files: ['*.stories.ts'],
            extends: ['plugin:storybook/recommended'],
            rules: {
                // Storybook files will not be in published package and are allowed to use devDependencies
                'import/no-extraneous-dependencies': [
                    'error',
                    { devDependencies: true }
                ],
                'import/no-default-export': 'off',
                'storybook/prefer-pascal-case': 'off'
            }
        },
        {
            files: ['*.spec.ts'],
            env: {
                jasmine: true
            },
            rules: {
                // Classes defined in test code aren't part of the public API so don't need docs
                'jsdoc/require-jsdoc': 'off',
                'jsdoc/require-description': 'off'
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
