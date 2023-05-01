import { TextFieldType } from '@microsoft/fast-foundation';

/**
 * Values for the 'type' property of the text field.
 */
export { TextFieldType };

/**
 * Values for the 'appearance' property of the text field
 */
export const TextFieldAppearance = {
    underline: 'underline',
    outline: 'outline',
    block: 'block',
    frameless: 'frameless'
} as const;

export type TextFieldAppearance =
    (typeof TextFieldAppearance)[keyof typeof TextFieldAppearance];
