module.exports = {
    extends: '@ni/eslint-config-javascript',
    parserOptions: {
        ecmaVersion: 2020
    },
    rules: {
        // Enabled to prevent accidental usage of async-await
        'require-await': 'error',
        'no-return-await': 'off',

        // This rule's configuration is based on the NI javascript styleguide:
        // https://github.com/ni/javascript-styleguide/blob/a1a6abd7adca7d9acd002705101b351d695b2442/packages/eslint-config-javascript/index.js
        // The only difference is that we're increasing the value of minProperties (from 6) so
        // that eslint doesn't introduce line breaks where prettier doesn't. If eslint introduces
        // line breaks, they will be unix-style, which will cause pointless diffs in git.
        'object-curly-newline': ['error', {
            ObjectExpression: { minProperties: 1000, multiline: true, consistent: true },
            ObjectPattern: { minProperties: 1000, multiline: true, consistent: true },
            ImportDeclaration: { consistent: true },
            ExportDeclaration: { consistent: true }
        }],
    },
};
