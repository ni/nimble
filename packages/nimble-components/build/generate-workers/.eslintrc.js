module.exports = {
    // TODO create an issue to re-enable linting
    // When enabled can remove ignorePatterns
    ignorePatterns: [
        '*'
    ],
    overrides: [
        {
            files: ['*.ts'],
            parserOptions: {
                project: './tsconfig.json',
                tsconfigRootDir: __dirname
            },
        }
    ]
};
