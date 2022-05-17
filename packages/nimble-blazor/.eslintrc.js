module.exports = {
    root: true,
    extends: [
        '@ni/eslint-config-javascript'
    ],
    overrides: [
        {
            files: [
                'build/**/*.js'
            ],
            rules: {
                // Default setting reports errors using devDependencies in build scripts; this allows it
                'import/no-extraneous-dependencies': ['error', { bundledDependencies: true, devDependencies: true, optionalDependencies: true, peerDependencies: true }],

                // Okay to use console.log in build scripts
                'no-console': 'off',

                // Rollup config files use default exports
                'import/no-default-export': 'off'
            }
        }
    ]
};