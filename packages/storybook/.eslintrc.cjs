module.exports = {
    root: true,
    extends: '@ni-private/eslint-config-nimble/typescript',
    ignorePatterns: ['.eslintrc.cjs', '*.mdx'],
    parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: __dirname
    },
    overrides: [
        {
            files: ['*.ts', '*.tsx'],
            rules: {
                // Storybook files will not be in published package and are allowed to use devDependencies
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
                                group: ['@ni/nimble-components/*', '@ni/spright-components/*'],
                                message:
                                    'For storybook, link directly to the nimble-components or spright-components source path in the monorepo instead.'
                            },
                        ]
                    }
                ],
            }
        }
    ]
};
