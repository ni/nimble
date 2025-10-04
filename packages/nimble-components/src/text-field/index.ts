import { attr, customElement, html } from '@ni/fast-element';
import { TextField as FoundationTextField } from '@ni/fast-foundation';
import { styles } from './styles';
import { TextFieldAppearance } from './types';
import { errorTextTemplate } from '../patterns/error/template';
import { mixinErrorPattern } from '../patterns/error/types';
import { iconExclamationMarkTag } from '../icons/exclamation-mark';
import { template } from './template';
import { mixinRequiredVisiblePattern } from '../patterns/required-visible/types';
import { elementDefinitionContextMock } from '../utilities/models/mock';

export const textFieldTag = 'nimble-text-field';

declare global {
    interface HTMLElementTagNameMap {
        [textFieldTag]: TextField;
    }
}

/**
 * A nimble-styed HTML text input
 */
@customElement({
    name: textFieldTag,
    template: template(elementDefinitionContextMock, {
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
    }),
    styles,
    shadowOptions: {
        delegatesFocus: true
    }
})
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

    @attr({ attribute: 'appearance-readonly', mode: 'boolean' })
    public appearanceReadOnly = false;
}
