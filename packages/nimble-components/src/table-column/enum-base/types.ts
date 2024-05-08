/**
 * Input data types for mapping-based columns
 * @public
 */
export const MappingKeyType = {
    string: 'string',
    number: 'number',
    boolean: 'boolean'
} as const;
export type MappingKeyType =
    (typeof MappingKeyType)[keyof typeof MappingKeyType];
