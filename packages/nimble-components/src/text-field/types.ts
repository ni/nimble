import { TextFieldType } from '@microsoft/fast-foundation';

/**
 * Values for the 'type' attribute of the text field.
 */
export type TextFieldTypeAttribute = `${TextFieldType}`;

/**
 * Values for the 'type' property of the text field.
 */
export { TextFieldType };

/**
 * Values for the 'appearance' attribute of the text field.
 */
export type TextFieldAppearanceAttribute = `${TextFieldAppearance}`;

/**
 * Values for the 'appearance' property of the text field
 */
export enum TextFieldAppearance {
    Underline = 'underline',
    Outline = 'outline',
    Block = 'block',
    Frameless = 'frameless'
}
