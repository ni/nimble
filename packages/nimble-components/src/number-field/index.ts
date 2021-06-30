import { DesignSystem, NumberField, NumberFieldOptions, numberFieldTemplate as template } from '@microsoft/fast-foundation';
import { numberFieldStyles as styles } from '@microsoft/fast-components';

const nimbleNumberField = NumberField.compose<NumberFieldOptions>({
    baseName: 'number-field',
    template,
    styles,
    shadowOptions: {
        delegatesFocus: true
    },
    stepDownGlyph: `
        <span class="step-down-glyph" part="step-down-glyph"></span>
    `,
    stepUpGlyph: `
        <span class="step-up-glyph" part="step-up-glyph"></span>
    `,
})

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleNumberField());
