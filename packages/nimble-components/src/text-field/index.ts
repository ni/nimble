import { attr, html } from '@microsoft/fast-element';
import {
    DesignSystem,
    TextField as FoundationTextField,
    TextFieldOptions,
    textFieldTemplate as template
} from '@microsoft/fast-foundation';
import { styles } from './styles';
import { TextFieldAppearance } from './types';
import { errorTextTemplate } from '../patterns/error/template';
import type { ErrorPattern } from '../patterns/error/types';
import { iconExclamationMarkTag } from '../icons/exclamation-mark';

const baseName = 'text-field';
export const textFieldTag = `nimble-${baseName}`;
declare global {
    interface HTMLElementTagNameMap {
        [textFieldTag]: TextField;
    }
}

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

const nimbleTextField = TextField.compose<TextFieldOptions>({
    baseName,
    baseClass: FoundationTextField,
    template,
    styles,
    shadowOptions: {
        delegatesFocus: true
    },
    end: html<TextField>`
        <${iconExclamationMarkTag}
            severity="error"
            class="error-icon"
        ></${iconExclamationMarkTag}>
        <span part="actions">
            <slot name="actions"></slot>
        </span>
        ${errorTextTemplate}
    `
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleTextField());
