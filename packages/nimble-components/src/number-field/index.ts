import {
    DesignSystem,
    NumberField as FoundationNumberField,
    NumberFieldOptions,
    numberFieldTemplate as template
} from '@microsoft/fast-foundation';
import {
    arrowExpanderDown16X16,
    arrowExpanderUp16X16
} from '@ni/nimble-tokens/dist-icons-esm/nimble-icons-inline';
import { styles } from './styles';

export type { NumberField };

declare global {
    interface HTMLElementTagNameMap {
        'nimble-number-field': NumberField;
    }
}

/**
 * A nimble-styled HTML number input
 */
class NumberField extends FoundationNumberField {}

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
    // @ts-expect-error FAST templates have incorrect type, see: https://github.com/microsoft/fast/issues/5047
    template,
    styles,
    shadowOptions: {
        delegatesFocus: true
    },
    stepDownGlyph: arrowExpanderDown16X16.data,
    stepUpGlyph: arrowExpanderUp16X16.data
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleNumberField());
