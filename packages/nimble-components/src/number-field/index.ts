import { attr, html } from '@microsoft/fast-element';
import {
    DesignSystem,
    NumberField as FoundationNumberField,
    NumberFieldOptions,
    numberFieldTemplate as template
} from '@microsoft/fast-foundation';
import { styles } from './styles';
import { NumberFieldAppearance } from './types';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-number-field': NumberField;
    }
}

/**
 * A nimble-styled HTML number input
 */
export class NumberField extends FoundationNumberField {
    @attr
    public appearance: NumberFieldAppearance = NumberFieldAppearance.underline;

    public override connectedCallback(): void {
        super.connectedCallback();

        // Reverse the order of the step-up div and the step-down div (so that step-down comes first).
        // This is the only way to get the tab order the way we want.
        const controlsDiv = this.control.nextElementSibling!;
        const stepUpDiv = controlsDiv.querySelector('.step-up');
        if (stepUpDiv) {
            controlsDiv.removeChild(stepUpDiv);
            controlsDiv.appendChild(stepUpDiv);
        }
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
            class="inc-dec-button"
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
            class="inc-dec-button"
            appearance="ghost"
            content-hidden
            tabindex="-1"
        >
            "Increment"
            <nimble-icon-add slot="start"></nimble-icon-add>
        </nimble-button>
    `
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleNumberField());
