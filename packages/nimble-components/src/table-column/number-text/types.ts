/**
 * Number text table column format options
 * @public
 */
export const Format = {
    default: undefined,
    intl: 'intl'
} as const;
export type Format = (typeof Format)[keyof typeof Format];
