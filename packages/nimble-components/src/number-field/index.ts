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
import '../icons/add';
import '../icons/exclamation-mark';
import '../icons/minus-wide';
import type { ErrorPattern } from '../patterns/error/types';

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
    stepDownGlyph: html`
        <nimble-button
            class="step-up-down-button"
            appearance="ghost"
            content-hidden
            tabindex="-1"
        >
            "Decrement"
            <nimble-icon-minus-wide slot="start"></nimble-icon-minus-wide>
        </nimble-button>
    `,
    stepUpGlyph: html`
        <nimble-button
            class="step-up-down-button"
            appearance="ghost"
            content-hidden
            tabindex="-1"
        >
            "Increment"
            <nimble-icon-add slot="start"></nimble-icon-add>
        </nimble-button>
    `,
    end: html<NumberField>`
        <nimble-icon-exclamation-mark
            class="error-icon fail"
        ></nimble-icon-exclamation-mark>
        ${errorTextTemplate}
    `
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleNumberField());
