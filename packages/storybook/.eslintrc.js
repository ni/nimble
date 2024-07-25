module.exports = {
    root: true,
    ignorePatterns: [
        'node_modules',
        'dist',
        // Force inclusion of storybook dot file hidden folder
        '!/.storybook',
        '/.storybook/blocks/StoryLayout.tsx'
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

                // Disables a rule from storybook recommended we have not followed
                // No reason we couldn't other than low ROI
                'storybook/prefer-pascal-case': 'off'
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
