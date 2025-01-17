/**
 * Values for the 'appearance' property of the number field
 */
export const FormattedNumberFieldAppearance = {
    underline: 'underline',
    outline: 'outline',
    block: 'block'
} as const;

export type FormattedNumberFieldAppearance =
    (typeof FormattedNumberFieldAppearance)[keyof typeof FormattedNumberFieldAppearance];
