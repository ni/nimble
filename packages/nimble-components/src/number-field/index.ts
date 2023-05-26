import { attr, html } from '@microsoft/fast-element';
import {
    DesignSystem,
    NumberField as FoundationNumberField,
    NumberFieldOptions,
    numberFieldTemplate as template
} from '@microsoft/fast-foundation';
import { styles } from './styles';
import { NumberFieldAppearance } from './types';
import { errorTextTemplate } from '../patterns/error/template';
import type { ErrorPattern } from '../patterns/error/types';
import { buttonTag } from '../button';
import { iconMinusWideTag } from '../icons/minus-wide';
import { iconAddTag } from '../icons/add';
import { iconExclamationMarkTag } from '../icons/exclamation-mark';
import { labelNumberFieldDecrement, labelNumberFieldIncrement } from '../labels';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-number-field': NumberField;
    }
}

/**
 * A nimble-styled HTML number input
 */
export class NumberField extends FoundationNumberField implements ErrorPattern {
    @attr
    public appearance: NumberFieldAppearance = NumberFieldAppearance.underline;

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

    public override connectedCallback(): void {
        super.connectedCallback();

        // This is a workaround for FAST issue: https://github.com/microsoft/fast/issues/6148
        this.control.setAttribute('role', 'spinbutton');
    }
}

/**
 * A function that returns a number-field registration for configuring the component with a DesignSystem.
 *
 * @public
 * @remarks
 * Generates HTML Element: \<nimble-number-field\>
 *
 */
const nimbleNumberField = NumberField.compose<NumberFieldOptions>({
    baseName: 'number-field',
    baseClass: FoundationNumberField,
    template,
    styles,
    shadowOptions: {
        delegatesFocus: true
    },
    stepDownGlyph: html<NumberField>`
        <${buttonTag}
            class="step-up-down-button"
            appearance="ghost"
            tabindex="-1"
        >
            ${x => labelNumberFieldDecrement.getValueFor(x)}
            <${iconMinusWideTag}
                slot="start"
            >
            </${iconMinusWideTag}>
        </${buttonTag}>
    `,
    stepUpGlyph: html<NumberField>`
        <${buttonTag}
            class="step-up-down-button"
            appearance="ghost"
            tabindex="-1"
        >
            ${x => labelNumberFieldIncrement.getValueFor(x)}
            <${iconAddTag}
                slot="start">
            </${iconAddTag}>
        </${buttonTag}>
    `,
    end: html<NumberField>`
        <${iconExclamationMarkTag}
            severity="error"
            class="error-icon"
        ></${iconExclamationMarkTag}>
        ${errorTextTemplate}
    `
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleNumberField());
export const numberFieldTag = DesignSystem.tagFor(NumberField);
