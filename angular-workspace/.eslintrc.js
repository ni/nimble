module.exports = {
    extends: [
        '@ni/eslint-config/typescript',
        '@ni/eslint-config/typescript-requiring-type-checking'
    ],
    rules: {
        // *-default-export lines can be deleted once a fix for this issue is published and uptaken
        // https://github.com/ni/javascript-styleguide/issues/39
        'import/prefer-default-export': 'off',
        'import/no-default-export': 'error'
    }
};