import { attr, html } from '@microsoft/fast-element';
import {
    DesignSystem,
    TextField as FoundationTextField,
} from '@microsoft/fast-foundation';
import { TextFieldAppearance } from './types';
import { errorTextTemplate } from '../patterns/error/template';
import type { ErrorPattern } from '../patterns/error/types';
import { iconExclamationMarkTag } from '../icons/exclamation-mark';

/**
 * A nimble-styed HTML text input
 */
export class TextField extends FoundationTextField implements ErrorPattern {
    /**
     * The appearance the text field should have.
     *
     * @public
     * @remarks
     * HTML Attribute: appearance
     */
    @attr
    public appearance: TextFieldAppearance = TextFieldAppearance.underline;

    /**
     * A message explaining why the value is invalid.
     *
     * @public
     * @remarks
     * HTML Attribute: error-text
     */
    @attr({ attribute: 'error-text' })
    public errorText?: string;

    @attr({ attribute: 'error-visible', mode: 'boolean' })
    public errorVisible = false;

    @attr({ attribute: 'full-bleed', mode: 'boolean' })
    public fullBleed = false;
}

export const endSlotTemplate = html<TextField>`
<${iconExclamationMarkTag}
    severity="error"
    class="error-icon"
></${iconExclamationMarkTag}>
<span part="actions">
    <slot name="actions"></slot>
</span>
${errorTextTemplate}
`;

export const textFieldTag = DesignSystem.tagFor(TextField);
