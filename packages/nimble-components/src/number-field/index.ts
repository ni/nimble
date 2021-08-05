import {
    DesignSystem,
    NumberField,
    NumberFieldOptions,
    numberFieldTemplate as template
} from '@microsoft/fast-foundation';
import {
    downArrow16X16,
    upArrow16X16
} from '@ni/nimble-tokens/dist-icons-esm/nimble-icons-inline';
import { styles } from './styles';

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
    template,
    styles,
    shadowOptions: {
        delegatesFocus: true
    },
    stepDownGlyph: `${downArrow16X16.data}`,
    stepUpGlyph: `${upArrow16X16.data}`
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleNumberField());
