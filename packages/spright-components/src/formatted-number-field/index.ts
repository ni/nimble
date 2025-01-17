import { attr, html } from '@microsoft/fast-element';
import {
    DesignSystem,
    NumberField as FoundationNumberField,
    type NumberFieldOptions
} from '@microsoft/fast-foundation';
import { errorTextTemplate } from '@ni/nimble-components/dist/esm/patterns/error/template';
import { mixinErrorPattern } from '@ni/nimble-components/dist/esm/patterns/error/types';
import { buttonTag } from '@ni/nimble-components/dist/esm/button';
import { iconMinusWideTag } from '@ni/nimble-components/dist/esm/icons/minus-wide';
import { iconAddTag } from '@ni/nimble-components/dist/esm/icons/add';
import { iconExclamationMarkTag } from '@ni/nimble-components/dist/esm/icons/exclamation-mark';
import {
    numericDecrementLabel,
    numericIncrementLabel
} from '@ni/nimble-components/dist/esm/label-provider/core/label-tokens';
import { mixinRequiredVisiblePattern } from '@ni/nimble-components/dist/esm/patterns/required-visible/types';
import { template } from './template';
import { FormattedNumberFieldAppearance } from './types';
import { styles } from './styles';

declare global {
    interface HTMLElementTagNameMap {
        'spright-formatted-number-field': FormattedNumberField;
    }
}

/**
 * A nimble-styled formatted number input
 */
export class FormattedNumberField extends mixinErrorPattern(
    mixinRequiredVisiblePattern(FoundationNumberField)
) {
    @attr
    public appearance: FormattedNumberFieldAppearance = FormattedNumberFieldAppearance.underline;

    public override connectedCallback(): void {
        super.connectedCallback();

        // This is a workaround for FAST issue: https://github.com/microsoft/fast/issues/6148
        this.control.setAttribute('role', 'spinbutton');
    }
}

/**
 * A function that returns a number-field registration for configuring the component with a DesignSystem.
 *
 * @public
 * @remarks
 * Generates HTML Element: \<spright-formatted-number-field\>
 *
 */
const sprightFormattedNumberField = FormattedNumberField.compose<NumberFieldOptions>({
    baseName: 'formatted-number-field',
    baseClass: FoundationNumberField,
    template,
    styles,
    shadowOptions: {
        delegatesFocus: true
    },
    stepDownGlyph: html<FormattedNumberField>`
        <${buttonTag}
            class="step-up-down-button"
            appearance="ghost"
            content-hidden
            tabindex="-1"
            aria-hidden="true"
        >
            ${x => numericDecrementLabel.getValueFor(x)}
            <${iconMinusWideTag}
                slot="start"
            >
            </${iconMinusWideTag}>
        </${buttonTag}>
    `,
    stepUpGlyph: html<FormattedNumberField>`
        <${buttonTag}
            class="step-up-down-button"
            appearance="ghost"
            content-hidden
            tabindex="-1"
            aria-hidden="true"
        >
            ${x => numericIncrementLabel.getValueFor(x)}
            <${iconAddTag}
                slot="start">
            </${iconAddTag}>
        </${buttonTag}>
    `,
    end: html<FormattedNumberField>`
        <${iconExclamationMarkTag}
            severity="error"
            class="error-icon"
        ></${iconExclamationMarkTag}>
        ${errorTextTemplate}
    `
});

DesignSystem.getOrCreate().withPrefix('spright').register(sprightFormattedNumberField());
export const formattedNumberFieldTag = 'spright-formatted-number-field';
