/**
 * Generic normalize method that removes the accents and special characters.
 * This method can be used to normalize the string before performing diacritic-insensitive string comparisons
 */
export const normalizeString = (value: string): string => {
    // This implementation is based on the below reference.
    // https://claritydev.net/blog/diacritic-insensitive-string-comparison-javascript
    return value
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase();
};