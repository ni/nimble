import { attr, html } from '@microsoft/fast-element';
import {
    DesignSystem,
    NumberField as FoundationNumberField,
    NumberFieldOptions,
    numberFieldTemplate as template
} from '@microsoft/fast-foundation';
import { styles } from './styles';
import { NumberFieldAppearance } from './types';
import { errorTextTemplate } from '../patterns/error/template';
import type { ErrorPattern } from '../patterns/error/types';
import { Button } from '../button';
import { IconMinusWide } from '../icons/minus-wide';
import { IconAdd } from '../icons/add';
import { IconExclamationMark } from '../icons/exclamation-mark';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-number-field': NumberField;
    }
}

/**
 * A nimble-styled HTML number input
 */
export class NumberField extends FoundationNumberField implements ErrorPattern {
    @attr
    public appearance: NumberFieldAppearance = NumberFieldAppearance.underline;

    /**
     * A message explaining why the value is invalid.
     *
     * @public
     * @remarks
     * HTML Attribute: error-text
     */
    @attr({ attribute: 'error-text' })
    public errorText?: string;

    @attr({ attribute: 'error-visible', mode: 'boolean' })
    public errorVisible = false;

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
    stepDownGlyph: html`
        <${DesignSystem.tagFor(Button)}
            class="step-up-down-button"
            appearance="ghost"
            content-hidden
            tabindex="-1"
        >
            "Decrement"
            <${DesignSystem.tagFor(IconMinusWide)}
                slot="start"
            >
            </${DesignSystem.tagFor(IconMinusWide)}>
        </${DesignSystem.tagFor(Button)}>
    `,
    stepUpGlyph: html`
        <${DesignSystem.tagFor(Button)}
            class="step-up-down-button"
            appearance="ghost"
            content-hidden
            tabindex="-1"
        >
            "Increment"
            <${DesignSystem.tagFor(IconAdd)}
                slot="start">
            </${DesignSystem.tagFor(IconAdd)}>
        </${DesignSystem.tagFor(Button)}>
    `,
    end: html<NumberField>`
        <${DesignSystem.tagFor(IconExclamationMark)}
            severity="error"
            class="error-icon"
        ></${DesignSystem.tagFor(IconExclamationMark)}>
        ${errorTextTemplate}
    `
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleNumberField());
