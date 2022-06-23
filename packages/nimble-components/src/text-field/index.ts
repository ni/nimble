import { attr, html } from '@microsoft/fast-element';
import {
    DesignSystem,
    TextField as FoundationTextField,
    TextFieldOptions,
    textFieldTemplate as template
} from '@microsoft/fast-foundation';
import '../icons/exclamation-mark';
import { styles } from './styles';
import { TextFieldAppearance } from './types';
import { errorTextTemplate } from '../patterns/error/template';
import type { IHasErrorText } from '../patterns/error/types';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-text-field': TextField;
    }
}

/**
 * A nimble-styed HTML text input
 */
export class TextField extends FoundationTextField implements IHasErrorText {
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
    public errorText: string | undefined;

    public override connectedCallback(): void {
        super.connectedCallback();
        this.control.setAttribute('aria-errormessage', 'errortext');
    }
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
        <nimble-icon-exclamation-mark
            class="error-icon fail"
        ></nimble-icon-exclamation-mark>
        <span part="actions">
            <slot name="actions"></slot>
        </span>
        ${errorTextTemplate}
    `
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleTextField());
