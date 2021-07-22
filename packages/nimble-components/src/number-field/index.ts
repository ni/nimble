import {
    DesignSystem,
    NumberField,
    NumberFieldOptions,
    numberFieldTemplate as template
} from '@microsoft/fast-foundation';
import { styles } from './styles';
import { nimbleIconNames } from '../shared/icon-font';

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
    stepDownGlyph: `
        <i class="${nimbleIconNames.DownArrow}"></i>
    `,
    stepUpGlyph: `
        <i class="${nimbleIconNames.UpArrow}"></i>
    `
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleNumberField());
