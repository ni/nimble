import {
    DesignSystem,
    NumberField,
    NumberFieldOptions,
    numberFieldTemplate as template
} from '@microsoft/fast-foundation';
import { styles } from './styles';
import { nimbleIconNames } from '../shared/icon-font';

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
