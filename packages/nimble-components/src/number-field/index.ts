import {
    DesignSystem,
    NumberField as FoundationNumberField,
    NumberFieldOptions,
    numberFieldTemplate as template
} from '@microsoft/fast-foundation';
import {
    controlsArrowExpanderDown16X16,
    controlsArrowExpanderUp16X16
} from '@ni/nimble-tokens/dist-icons-esm/nimble-icons-inline';
import { styles } from './styles';

/**
 * A nimble-styled HTML number input
 */
type NumberField = FoundationNumberField;

export type { NumberField };

/**
 * A function that returns a number-field registration for configuring the component with a DesignSystem.
 *
 * @public
 * @remarks
 * Generates HTML Element: \<nimble-number-field\>
 *
 */
const nimbleNumberField = FoundationNumberField.compose<NumberFieldOptions>({
    baseName: 'number-field',
    template,
    styles,
    shadowOptions: {
        delegatesFocus: true
    },
    stepDownGlyph: controlsArrowExpanderDown16X16.data,
    stepUpGlyph: controlsArrowExpanderUp16X16.data
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleNumberField());
