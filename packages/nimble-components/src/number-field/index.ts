import { attr } from '@microsoft/fast-element';
import {
    DesignSystem,
    NumberField as FoundationNumberField,
    NumberFieldOptions,
    numberFieldTemplate as template
} from '@microsoft/fast-foundation';
import { add16X16, minusWide16X16 } from '@ni/nimble-tokens/dist/icons/js';
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
    stepDownGlyph: minusWide16X16.data,
    stepUpGlyph: add16X16.data
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleNumberField());
