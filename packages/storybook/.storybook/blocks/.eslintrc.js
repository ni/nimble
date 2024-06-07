module.exports = {
    overrides: [
        {
            files: ['*.tsx'],
            parserOptions: {
                project: './tsconfig.json',
                tsconfigRootDir: __dirname
            },
        }
    ]
};
