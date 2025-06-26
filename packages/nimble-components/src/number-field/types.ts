/**
 * Values for the 'appearance' property of the number field
 */
export const NumberFieldAppearance = {
    underline: 'underline',
    outline: 'outline',
    block: 'block',
    frameless: 'frameless'
} as const;

export type NumberFieldAppearance =
    (typeof NumberFieldAppearance)[keyof typeof NumberFieldAppearance];
