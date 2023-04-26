module.exports = {
    root: true,
    extends: [
        '@ni/eslint-config-javascript'
    ],
    overrides: [
        {
            parserOptions: {
                ecmaVersion: '2020'
            },
            files: [
                'source/styledictionary/*.js',
            ],
            rules: {
                // Build scripts will not be in published package and are allowed to use devDependencies
                'import/no-extraneous-dependencies': ['error', { devDependencies: true }],

                // Okay to use console.log in build scripts
                'no-console': 'off',

                // Enabled to prevent accidental usage of async-await
                'require-await': 'error'
            }
        }
    ]
};