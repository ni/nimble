export const FvDateTimePickerAppearance = {
    underline: 'underline',
    outline: 'outline',
    block: 'block',
    frameless: 'frameless'
} as const;

export type FvDateTimePickerAppearance = (typeof FvDateTimePickerAppearance)[keyof typeof FvDateTimePickerAppearance];

export const FvDateTimePickerType = {
    date: 'date',
    datetimeLocal: 'datetime-local'
} as const;

export type FvDateTimePickerType = (typeof FvDateTimePickerType)[keyof typeof FvDateTimePickerType];
