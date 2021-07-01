import { DesignSystem, ElementDefinitionContext, FoundationElementDefinition, NumberField, NumberFieldOptions, numberFieldTemplate as template } from '@microsoft/fast-foundation';
import { numberFieldStyles as styles } from '@microsoft/fast-components';
import { css, ElementStyles } from '@microsoft/fast-element';
import { nimbleIconFontStyles } from '@ni/nimble-tokens/dist/icons/nimble-icon-font';

const overrideStyles = (context: ElementDefinitionContext,
    definition: FoundationElementDefinition): ElementStyles => css`${styles(context, definition)}${nimbleIconFontStyles}`;

const nimbleNumberField = NumberField.compose<NumberFieldOptions>({
    baseName: 'number-field',
    template,
    styles: overrideStyles,
    shadowOptions: {
        delegatesFocus: true
    },
    stepDownGlyph: `
        <i class="nimble-icon-font-Fail_16x16"></i>
    `,
    stepUpGlyph: `
        <i class="nimble-icon-font-Succeeded_16x16"></i>
    `,
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleNumberField());
