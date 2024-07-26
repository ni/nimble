module.exports = {
    extends: [
        '@ni-private/eslint-config-nimble/typescript',
    ],
    rules: {
        'no-restricted-syntax': [
            'error',
            {
                selector: 'TSEnumDeclaration',
                message:
                    'Use a const object instead of an enum. See other types.ts files for examples.'
            }
        ],

        // Improves readability of templates to avoid return types in template expressions
        '@typescript-eslint/explicit-function-return-type': [
            'error',
            { allowExpressions: true }
        ],

        'no-restricted-imports': [
            'error',
            {
                paths: [
                    ...restrictedFastImports()
                ]
            }
        ],
    },
    overrides: [
        {
            files: ['*.spec.ts'],
            env: {
                jasmine: true
            },
            rules: {
                'no-restricted-imports': [
                    'error',
                    {
                        paths: [
                            ...restrictedFastImports(),
                            {
                                name: '@microsoft/fast-element',
                                importNames: ['DOM'],
                                message:
                                    'For tests, please use functions from src/testing/async-helpers instead.'
                            }
                        ]
                    }
                ],
            }
        },
        {
            files: ['*.foundation.spec.ts'],
            rules: {
                'no-restricted-imports': [
                    'error',
                    {
                        paths: [
                            ...restrictedFastImports()
                        ]
                    }
                ]
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
            files: ['template.ts'],
            rules: {
                // Using '??' in templates does not get flagged correctly by FAST as being a volatile binding.
                // See https://github.com/ni/nimble/issues/1843 for more information.
                'no-restricted-syntax': [
                    'error',
                    { selector: "LogicalExpression[operator='??']" }
                ]
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
                        format: ['camelCase']
                    },
                    {
                        selector: 'variable',
                        format: ['camelCase', 'PascalCase']
                    },
                    {
                        selector: 'typeLike',
                        format: ['PascalCase']
                    },
                    {
                        selector: 'default',
                        format: ['camelCase'],
                        leadingUnderscore: 'allow',
                        trailingUnderscore: 'allow'
                    }
                ]
            }
        }
    ]
};

function restrictedFastImports() {
    return [
        {
            name: '@microsoft/fast-foundation',
            importNames: ['focusVisible'],
            message:
                'Please use focusVisible from src/utilities/style/focus instead.'
        },
        {
            name: '@microsoft/fast-foundation',
            importNames: ['display'],
            message:
                'Please use display from src/utilities/style/display instead.'
        },
        {
            name: '@microsoft/fast-components',
            message:
                'It is not expected to leverage @microsoft/fast-components directly as they are coupled to FAST design tokens.'
        }
    ];
}
