module.exports = {
    root: true,
    ignorePatterns: [
        'node_modules',
        'dist',
        // Force inclusion of storybook dot file hidden folder
        '!/.storybook',
        'src/nimble/icons'
    ],
    overrides: [
        {
            files: ['*.js'],
            extends: ['@ni-private/eslint-config-nimble/javascript']
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
                'import/no-default-export': 'off',
                // This rule is disabled in order to allow linking directly to nimble-components and spright-components source
                // Other files in the repo should NOT directly link to source and should resolve with the package identifier instead
                'import/no-relative-packages': 'off',
                'no-restricted-imports': [
                    'error',
                    {
                        patterns: [
                            {
                                group: ['*/nimble-components/dist/esm/*', '*/spright-components/dist/esm/*'],
                                message:
                                    'For storybook, link directly to the nimble-components or spright-components typescript source path in the monorepo with a relative path instead of dist build output.'
                            },
                        ]
                    }
                ],
                // Storybook is not a published package and is allowed to use devDependencies
                'import/no-extraneous-dependencies': [
                    'error',
                    { devDependencies: true }
                ],
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
                // Rollup config files use default exports
                'import/no-default-export': 'off',
            },
        }
    ]
};
