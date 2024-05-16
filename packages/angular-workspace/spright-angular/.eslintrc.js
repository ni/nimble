module.exports = {
    extends: '../.eslintrc.js',
    overrides: [{
        files: ['*.ts'],
        parserOptions: {
            project: [
                './tsconfig.lib.json',
                './tsconfig.spec.json'
            ],
            tsconfigRootDir: __dirname
        }
    }]
};
