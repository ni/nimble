module.exports = {
    root: true,
    overrides: [{
        files: ['*.ts'],
        extends: [
            '@ni/eslint-config-angular',
            '@ni/eslint-config-typescript/requiring-type-checking'
        ],
        rules: {
            // *-default-export lines can be deleted once a fix for this issue is published and uptaken
            // https://github.com/ni/javascript-styleguide/issues/39
            'import/prefer-default-export': 'off',
            'import/no-default-export': 'error',
            'no-restricted-imports': ['error', {
                patterns:
                [{
                    group: ['@microsoft/fast-*'],
                    message: 'Do not directly use underlying libraries of nimble. Instead rely on or add to exports of nimble packages.'
                }]
            }]
        }
    },
    {
        files: ['*.html'],
        extends: [
            '@ni/eslint-config-angular/template'
        ],
        rules: {
            // nimble-angular shouldn't provide user-visible strings so doesn't need i18n
            // example-client-app is just for demo purposes and isn't anticipated to be localized
            '@angular-eslint/template/i18n': 'off'
        }
    }, {
        files: ['*.js'],
        extends: [
            '@ni/eslint-config-javascript'
        ],
    }]
};