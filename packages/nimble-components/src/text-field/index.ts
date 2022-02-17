import { attr, html, ViewTemplate } from '@microsoft/fast-element';
import {
    DesignSystem,
    ElementDefinitionContext,
    TextField as FoundationTextField,
    TextFieldOptions,
    textFieldTemplate as foundationTemplate
} from '@microsoft/fast-foundation';
import { exclamationMark16X16 } from '@ni/nimble-tokens/dist-icons-esm/nimble-icons-inline';
import { styles } from './styles';
import { TextFieldAppearance } from './types';

export type { TextField };

declare global {
    interface HTMLElementTagNameMap {
        'nimble-text-field': TextField;
    }
}

/**
 * A nimble-styed HTML text input
 */
class TextField extends FoundationTextField {
    /**
     * The appearance the text field should have.
     *
     * @public
     * @remarks
     * HTML Attribute: appearance
     */
    @attr
    public appearance!: TextFieldAppearance;

    /**
     * A message explaining why the value is invalid.
     *
     * @public
     * @remarks
     * HTML Attribute: errortext
     */
    @attr({ attribute: 'error-text' })
    public errorText!: string;

    public connectedCallback(): void {
        super.connectedCallback();
        if (!this.appearance) {
            this.appearance = TextFieldAppearance.Underline;
        }
    }
}

const template: (
    context: ElementDefinitionContext,
    definition: TextFieldOptions
) => ViewTemplate<TextField> = (
    context: ElementDefinitionContext,
    definition: TextFieldOptions
) => {
    return html`${foundationTemplate(context, definition)}
        <div class="errortext">${x => x.errorText}</div>`;
};

const nimbleTextField = TextField.compose<TextFieldOptions>({
    baseName: 'text-field',
    baseClass: FoundationTextField,
    // @ts-expect-error FAST templates have incorrect type, see: https://github.com/microsoft/fast/issues/5047
    template,
    styles,
    shadowOptions: {
        delegatesFocus: true
    },
    end: exclamationMark16X16.data
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleTextField());
