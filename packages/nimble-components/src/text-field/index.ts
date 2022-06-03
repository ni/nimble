import { attr, html } from '@microsoft/fast-element';
import {
    DesignSystem,
    TextField as FoundationTextField,
    TextFieldOptions,
    textFieldTemplate as template
} from '@microsoft/fast-foundation';
import { exclamationMark16X16 } from '@ni/nimble-tokens/dist-icons-esm/nimble-icons-inline';
import { styles } from './styles';
import { TextFieldAppearance } from './types';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-text-field': TextField;
    }
}

/**
 * A nimble-styed HTML text input
 */
export class TextField extends FoundationTextField {
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
    public errorText!: string;

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
        <span class="error-content">${exclamationMark16X16.data}</span>
        <span part="actions">
            <slot name="actions"></slot>
        </span>
        <div
            class="error-text error-content"
            title="${x => x.errorText}"
            aria-live="polite"
        >
            ${x => x.errorText}
        </div>
    `
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleTextField());
