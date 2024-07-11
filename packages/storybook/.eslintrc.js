module.exports = {
    root: true,
    ignorePatterns: [
        'node_modules',
        'dist',
        // Force inclusion of storybook dot file hidden folder
        '!/.storybook',
        '/.storybook/blocks/StoryLayout.tsx',
        'src/nimble/icons'
    ],
    overrides: [
        {
            files: ['*.js'],
            extends: ['@ni-private/eslint-config-nimble/javascript'],
            rules: {
                // Storybook tends to rely on default exports in plugins
                'import/no-default-export': 'off',

                // Storybook is not a published package and is allowed to use devDependencies
                'import/no-extraneous-dependencies': [
                    'error',
                    { devDependencies: true }
                ],
            }
        },
        {
            files: ['*.ts', '*.tsx'],
            extends: [
                '@ni-private/eslint-config-nimble/components',
                'plugin:storybook/recommended'
            ],
            parserOptions: {
                project: './tsconfig.json',
                tsconfigRootDir: __dirname
            },
            rules: {
                // Storybook tends to rely on default exports in plugins
                'import/no-default-export': 'off',

                // Storybook is not a published package and is allowed to use devDependencies
                'import/no-extraneous-dependencies': [
                    'error',
                    { devDependencies: true }
                ],

                // This rule is disabled in order to allow linking directly to nimble-components and spright-components source
                // Other files in the repo should NOT directly link to source and should resolve with the package identifier instead
                'import/no-relative-packages': 'off',
                'no-restricted-imports': [
                    'error',
                    {
                        patterns: [
                            {
                                group: ['*/nimble-components/dist/esm/*', '*/spright-components/dist/esm/*', '@ni/nimble-components/*', '@ni/spright-components/*'],
                                message:
                                    'For storybook, link directly to the nimble-components or spright-components typescript source path in the monorepo with a relative path instead of dist build output.'
                            },
                        ]
                    }
                ],

                // Disables a rule from storybook recommended we have not followed
                // No reason we couldn't other than low ROI
                'storybook/prefer-pascal-case': 'off'
            }
        },
        {
            files: ['**/*.react.tsx'],
            rules: {
                // The React components should use PascalCase
                '@typescript-eslint/naming-convention': [
                    'error',
                    {
                        selector: 'objectLiteralProperty',
                        format: ['PascalCase']
                    }
                ]
            }
        },
        {
            files: ['build/**/*.js'],
            rules: {
                // Build scripts should give verbose logging
                'no-console': 'off',
            },
        },
        {
            files: ['.storybook/*.js'],
            env: {
                browser: true,
            }
        }
    ]
};
