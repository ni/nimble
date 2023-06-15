/** @type {import('typedoc').TypeDocOptions} */
module.exports = {
    entryPoints: [
        'src/**/index.ts'
        // 'src/**/types.ts'
        // 'src/**/*.ts',
    ],
    out: 'api-docs',
    excludeInternal: true,
    excludePrivate: true,
    plugin: [
        // 'typedoc-plugin-merge-modules',
        'typedoc-plugin-missing-exports',
        'typedoc-plugin-replace-text'
    ],
    internalModule: '[referenced types]',
    replaceText: {
        inCodeCommentText: true,
        inCodeCommentTags: true,
        inIncludedFiles: false,
        replacements: [
            // Some FAST API docs have @links with text containing HTML like <textarea>, which TypeDoc doesn't
            // escape. replace the <> with [] so the output HTML isn't broken in those cases.
            {
                pattern: '<(.*)(\\/)?>',
                replace: '[$1]'
            }
        ]
    }
};
