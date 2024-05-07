module.exports = {
    root: true,
    extends: [
        '@ni/eslint-config-javascript'
    ],
    parserOptions: {
        ecmaVersion: 2020
    },
    overrides: [
        {
            files: [
                'build/**/*.js'
            ],
            rules: {
                // Build scripts will not be in published package and are allowed to use devDependencies
                'import/no-extraneous-dependencies': ['error', { devDependencies: true }],

                // Okay to use console.log in build scripts
                'no-console': 'off',

                // Rollup config files use default exports
                'import/no-default-export': 'off',

                // Allow build to reference files in NimbleBlazor and SprightBlazor
                'import/no-relative-packages': 'off',

                // Enabled to prevent accidental usage of async-await
                'require-await': 'error'
            }
        }
    ]
};