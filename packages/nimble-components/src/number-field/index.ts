import { attr, html } from '@ni/fast-element';
import {
    DesignSystem,
    NumberField as FoundationNumberField,
    type DesignTokenSubscriber,
    type NumberFieldOptions
} from '@ni/fast-foundation';
import { styles } from './styles';
import { NumberFieldAppearance } from './types';
import { errorTextTemplate } from '../patterns/error/template';
import { mixinErrorPattern } from '../patterns/error/types';
import { buttonTag } from '../button';
import { iconMinusWideTag } from '../icons/minus-wide';
import { iconAddTag } from '../icons/add';
import { iconExclamationMarkTag } from '../icons/exclamation-mark';
import {
    numericDecrementLabel,
    numericIncrementLabel
} from '../label-provider/core/label-tokens';
import { template } from './template';
import { mixinRequiredVisiblePattern } from '../patterns/required-visible/types';
import { lang } from '../theme-provider';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-number-field': NumberField;
    }
}

/**
 * A nimble-styled HTML number input
 */
export class NumberField extends mixinErrorPattern(
    mixinRequiredVisiblePattern(FoundationNumberField)
) {
    @attr
    public appearance: NumberFieldAppearance = NumberFieldAppearance.underline;

    @attr({ attribute: 'full-bleed', mode: 'boolean' })
    public fullBleed = false;

    @attr({ attribute: 'appearance-readonly', mode: 'boolean' })
    public appearanceReadOnly = false;

    private decimalSeparator = '.';
    private inputFilterRegExp = this.buildFilterRegExp(this.decimalSeparator);

    private readonly langSubscriber: DesignTokenSubscriber<typeof lang> = {
        handleChange: () => this.updateDecimalSeparatorAndInputFilter()
    };

    public override connectedCallback(): void {
        super.connectedCallback();

        // This is a workaround for FAST issue: https://github.com/microsoft/fast/issues/6148
        this.control.setAttribute('role', 'spinbutton');
        this.updateDecimalSeparatorAndInputFilter();
        lang.subscribe(this.langSubscriber, this);
    }

    public override disconnectedCallback(): void {
        super.disconnectedCallback();

        lang.unsubscribe(this.langSubscriber, this);
    }

    protected override sanitizeInput(inputText: string): string {
        return inputText.replace(this.inputFilterRegExp, '');
    }

    // this.value <-- this.control.value
    protected override syncValueFromInnerControl(): void {
        this.value = this.decimalSeparator !== '.'
            ? this.control.value.replace(this.decimalSeparator, '.')
            : this.control.value;
    }

    // this.value --> this.control.value
    protected override syncValueToInnerControl(): void {
        this.control.value = this.decimalSeparator !== '.'
            ? this.value.replace('.', this.decimalSeparator)
            : this.value;
    }

    private updateDecimalSeparatorAndInputFilter(): void {
        const previousSeparator = this.decimalSeparator;
        this.decimalSeparator = this.getSeparatorForLanguange(
            lang.getValueFor(this)
        );
        if (this.decimalSeparator !== previousSeparator) {
            this.inputFilterRegExp = this.buildFilterRegExp(
                this.decimalSeparator
            );
            this.control.value = this.control.value.replace(
                previousSeparator,
                this.decimalSeparator
            );
        }
    }

    private getSeparatorForLanguange(language: string): string {
        return Intl.NumberFormat(language)
            .formatToParts(1.1)
            .find(x => x.type === 'decimal')!.value;
    }

    private buildFilterRegExp(decimalSeparator: string): RegExp {
        return new RegExp(`[^0-9\\-+e${decimalSeparator}]`, 'g');
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
    stepDownGlyph: html<NumberField>`
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
    stepUpGlyph: html<NumberField>`
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
    end: html<NumberField>`
        <${iconExclamationMarkTag}
            severity="error"
            class="error-icon"
        ></${iconExclamationMarkTag}>
        ${errorTextTemplate}
    `
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleNumberField());
export const numberFieldTag = 'nimble-number-field';
