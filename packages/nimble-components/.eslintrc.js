module.exports = {
    root: true,
    ignorePatterns: [
        'node_modules',
        'dist',
        'src/icons',
        'src/wafer-map/workers'
    ],
    overrides: [
        {
            files: ['*.js'],
            extends: ['@ni-private/eslint-config-nimble/javascript']
        },
        {
            files: ['*.ts'],
            extends: ['@ni-private/eslint-config-nimble/components'],
            parserOptions: {
                project: './tsconfig.json',
                tsconfigRootDir: __dirname
            },
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
