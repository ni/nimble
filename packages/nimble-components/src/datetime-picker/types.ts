/**
 * Values for the 'appearance' property of the date/time picker
 */
export const DateTimePickerAppearance = {
    underline: 'underline',
    outline: 'outline',
    block: 'block'
} as const;

export type DateTimePickerAppearance =
    (typeof DateTimePickerAppearance)[keyof typeof DateTimePickerAppearance];
