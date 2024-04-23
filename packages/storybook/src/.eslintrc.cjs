module.exports = {
    root: true,
    extends: '@ni-private/eslint-config-nimble/typescript',
    parserOptions: {
        project: '../tsconfig.json',
        tsconfigRootDir: __dirname
    },
    overrides: [
        {
            files: ['*.ts', '*.tsx'],
            rules: {
                // Storybook files will not be in published package and are allowed to use devDependencies
                'import/no-extraneous-dependencies': [
                    'error',
                    { devDependencies: true }
                ]
            }
        }
    ]
};
