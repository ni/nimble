module.exports = {
    ignorePatterns: [
        'index.ts'
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
