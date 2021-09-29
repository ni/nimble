module.exports = {
    root: true,
    extends: '@ni/eslint-config-javascript',
    parserOptions: {
        ecmaVersion: 2020
    },
    ignorePatterns: [
        // Force inclusion of storybook dot file hidden folder
        '!/.storybook',
        'node_modules',
        'dist'
    ],
    overrides: [
        {
            files: ['.storybook/**'],
            env: {
                browser: true
            },
            rules: {
                // Storybook files will not be in published package and are allowed to use devDependencies
                'import/no-extraneous-dependencies': [
                    'error',
                    { devDependencies: true }
                ],
                'import/no-default-export': 'off'
            }
        }
    ]
};
