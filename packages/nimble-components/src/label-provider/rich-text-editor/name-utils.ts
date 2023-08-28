/**
 * Removes the richTextEditor prefix and camelCases the input token name.
 * (The design token name has the richTextEditor prefix, but the properties on the LabelProviderRichTextEditor do not, as they're already
 * scoped to the rich-text-editor only)
 */
export function removeRichTextEditorPrefixAndCamelCase(
    jsTokenName: string
): string {
    // Example: 'richTextEditorToggleBulletListLabel' => 'toggleBulletListLabel'
    return jsTokenName.replace(
        /^richTextEditor(\w)(\w+)/,
        (_match: string, firstChar: string, restOfString: string) => `${firstChar.toLowerCase()}${restOfString}`
    );
}
