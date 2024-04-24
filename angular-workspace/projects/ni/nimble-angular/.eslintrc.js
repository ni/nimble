module.exports = {
    extends: '../../../.eslintrc.js',
    ignorePatterns: [
        '/src/thirdparty'
    ],
    overrides: [{
        files: ['*.ts'],
        parserOptions: {
            project: [
                './tsconfig.lib.json',
                './tsconfig.spec.json'
            ],
            tsconfigRootDir: __dirname
        }
    },
    {
        files: ['build/**/*.js'],
        rules: {
            // Logging in build scripts is useful
            'no-console': 'off',
            // Rollup config files use default exports
            'import/no-default-export': 'off'
        }
    }]
};
