import { attr, html } from '@ni/fast-element';
import {
    DesignSystem,
    TextField as FoundationTextField,
    type TextFieldOptions
} from '@ni/fast-foundation';
import { styles } from './styles';
import { TextFieldAppearance } from './types';
import { errorTextTemplate } from '../patterns/error/template';
import { mixinErrorPattern } from '../patterns/error/types';
import { iconExclamationMarkTag } from '../icons/exclamation-mark';
import { template } from './template';
import { mixinRequiredVisiblePattern } from '../patterns/required-visible/types';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-text-field': TextField;
    }
}

/**
 * A nimble-styed HTML text input
 */
export class TextField extends mixinErrorPattern(
    mixinRequiredVisiblePattern(FoundationTextField)
) {
    /**
     * The appearance the text field should have.
     *
     * @public
     * @remarks
     * HTML Attribute: appearance
     */
    @attr
    public appearance: TextFieldAppearance = TextFieldAppearance.underline;

    @attr({ attribute: 'full-bleed', mode: 'boolean' })
    public fullBleed = false;

    @attr({ attribute: 'readonly-interaction', mode: 'boolean' })
    public readonlyInteraction = false;
}

const nimbleTextField = TextField.compose<TextFieldOptions>({
    baseName: 'text-field',
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
export const textFieldTag = 'nimble-text-field';
