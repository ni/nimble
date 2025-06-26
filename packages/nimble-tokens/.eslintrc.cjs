module.exports = {
    root: true,
    ignorePatterns: [
        'node_modules',
        'dist',
        'dist/styledictionary/*',
    ],
    overrides: [
        {
            files: ['*.js', '*.cjs'],
            extends: ['@ni-private/eslint-config-nimble/javascript'],
            parserOptions: {
                ecmaVersion: '2022'
            },
        },
        {
            files: ['*.js'],
            rules: {
                'import/extensions': ['error',
                    'always',
                    {
                        ignorePackages: true,
                    }
                ],
                'import/no-unresolved': ['error',
                    {
                        ignore: ['^style-dictionary$'],
                    }
                ],
            }
        },
        {
            files: ['source/styledictionary/*.cjs'],
            rules: {
                // Build scripts will not be in published package and are allowed to use devDependencies
                'import/no-extraneous-dependencies': ['error', { devDependencies: true }],

                // Okay to use console.log in build scripts
                'no-console': 'off',
            }
        }
    ]
};
