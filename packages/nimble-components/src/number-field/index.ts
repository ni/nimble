import {
    DesignSystem,
    NumberField,
    NumberFieldOptions,
    numberFieldTemplate as template
} from '@microsoft/fast-foundation';
import {
    nimbleIconDownArrow,
    nimbleIconUpArrow
} from '@ni/nimble-tokens/dist-icons/nimble-icon.model';
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
    stepDownGlyph: `${nimbleIconDownArrow.data}`,
    stepUpGlyph: `${nimbleIconUpArrow.data}`
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleNumberField());
