/**
 * Removes the table prefix and camelCases the input token name.
 * (The design token name has the table prefix, but the properties on the LabelProviderTable do not, as they're already
 * scoped to the table only)
 */
export function removeTablePrefixAndCamelCase(jsTokenName: string): string {
    // Example: 'tableGroupExpandLabel' => 'groupExpandLabel'
    return jsTokenName.replace(
        /^table(\w)(\w+)/,
        (_match: string, firstChar: string, restOfString: string) => `${firstChar.toLowerCase()}${restOfString}`
    );
}
