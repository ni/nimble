module.exports = {
    root: true,
    overrides: [
        {
            files: ['**/*.ts'],
            extends: [
                '@ni/eslint-config-typescript',
                '@ni/eslint-config-typescript/requiring-type-checking'
            ],
            parserOptions: {
                project: 'tsconfig.json',
                tsconfigRootDir: __dirname
            },
            rules: {
                // This is a command line app so printing to console to show progress is desirable
                'no-console': 'off',
            },
        },
        {
            files: ['*.js'],
            extends: [
                '@ni/eslint-config-javascript'
            ],
        }
    ],
    ignorePatterns: ['dist', 'node_modules']
};
