import { spinalCase } from '@microsoft/fast-web-utilities';

export function getPropertyName(jsKey: string): string {
    return jsKey.replace(/Label$/, '');
}

export function getAttributeName(jsKey: string): string {
    return spinalCase(getPropertyName(jsKey));
}

/**
 * Removes the prefix and camelCases the input token name.
 * (The design token name has the element/types prefix, but the properties do not, as they're already
 * scoped to the respective element)
 * Example: 'richTextToggleBold' => 'toggleBold'
 */
export function removePrefixAndCamelCase(
    jsTokenName: string,
    prefix: string
): string {
    return jsTokenName.replace(
        new RegExp(String.raw`^${prefix}(\w)(\w+)`),
        (_match: string, firstChar: string, restOfString: string) => `${firstChar.toLowerCase()}${restOfString}`
    );
}
