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

        'no-restricted-syntax': ['error', {
            selector: 'TSEnumDeclaration',
            message: 'Use a const object instead of an enum. See other types.ts files for examples.'
        }],

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
                // Prettier and eslint conflict in how they format CSS in styles files and we prefer prettier's output
                '@typescript-eslint/indent': 'off'
            }
        },
        {
            // Instead of enums, this repo uses const objects and type unions which should live in types.ts
            files: ['types.ts'],
            rules: {
                // The const object and type union should have the same name
                '@typescript-eslint/no-redeclare': 'off',
                // Enum-like variables should use PascalCase and values should use camelCase
                // Also allow camelCase variables for things like attribute strings
                '@typescript-eslint/naming-convention': [
                    'error',
                    {
                        selector: 'objectLiteralProperty',
                        format: ['camelCase'],
                    },
                    {
                        selector: 'variable',
                        format: ['camelCase', 'PascalCase'],
                    },
                    {
                        selector: 'typeLike',
                        format: ['PascalCase'],
                    },
                    {
                        selector: 'default',
                        format: ['camelCase'],
                        leadingUnderscore: 'allow',
                        trailingUnderscore: 'allow',
                    },
                ],
            }
        }
    ]
};
