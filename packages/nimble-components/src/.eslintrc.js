module.exports = {
    root: true,
    extends: [
        '@ni/eslint-config/typescript',
        '@ni/eslint-config/typescript-requiring-type-checking'
    ],
    parserOptions: {
        project: '../tsconfig.json',
        tsconfigRootDir: __dirname
    },
    rules: {
        // *-default-export lines can be deleted once a fix for this issue is published and uptaken
        // https://github.com/ni/javascript-styleguide/issues/39
        'import/prefer-default-export': 'off',
        'import/no-default-export': 'error'
    },
    ignorePatterns: [
        '.eslintrc.js'
    ],
    overrides: [{
        files: ['*.stories.ts'],
        rules: {
            'import/no-extraneous-dependencies': ['error', { devDependencies: true }],
            'import/no-default-export': 'off'
        }
    }, {
        files: ['*.spec.ts'],
        env: {
            jasmine: true
        }
    }, {
        files: ['styles.ts'],
        rules: {
            // template literals are also used to comment on the css and
            // the comments should be intended accordingly
            '@typescript-eslint/indent': ['error', 4, { ignoredNodes: ['TemplateLiteral'] }]
        }
    }]
};
