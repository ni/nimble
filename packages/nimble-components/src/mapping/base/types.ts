/**
 * Input data types for mapping-based columns (i.e. enum text and icon)
 * @public
 */
export const MappingKeyType = {
    string: 'string',
    number: 'number',
    boolean: 'boolean'
} as const;
export type MappingKeyType =
    (typeof MappingKeyType)[keyof typeof MappingKeyType];

export type MappingKeyValue = string | number | boolean;

export interface MappingConfig {
    key: MappingKeyValue | null;
    defaultMapping: boolean;
}
