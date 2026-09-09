import { html, observable } from '@ni/fast-element';
import type { TextFieldOptions } from '@ni/fast-foundation';
import {
    Maskito,
    type MaskitoOptions,
    maskitoTransform
} from '@maskito/core';
import {
    TextField as NimbleTextField
} from '@ni/nimble-components/dist/esm/text-field';
import { styles } from '@ni/nimble-components/dist/esm/text-field/styles';
import { template } from '@ni/nimble-components/dist/esm/text-field/template';
import { errorTextTemplate } from '@ni/nimble-components/dist/esm/patterns/error/template';
import { iconExclamationMarkTag } from '@ni/nimble-components/dist/esm/icons/exclamation-mark';
import { DesignSystem } from '@ni/fast-foundation';

export type { MaskitoOptions } from '@maskito/core';

declare global {
    interface HTMLElementTagNameMap {
        'ok-fv-text-field': FvTextField;
    }
}

/**
 * A Nimble text field with optional Maskito input masking.
 */
export class FvTextField extends NimbleTextField {
    /**
     * Maskito configuration applied to user and programmatic input.
     *
     * @public
     * @remarks
     * This property is not reflected to an HTML attribute because Maskito
     * options can contain regular expressions and functions.
     */
    @observable
    public maskOptions?: MaskitoOptions;

    private maskito?: Maskito;
    private updatingValueFromControl = false;
    private normalizingValue = false;

    /** @internal */
    public override connectedCallback(): void {
        super.connectedCallback();
        this.initializeMask();
    }

    /** @internal */
    public override disconnectedCallback(): void {
        this.destroyMask();
        super.disconnectedCallback();
    }

    /** @internal */
    public maskOptionsChanged(): void {
        if (this.$fastController.isConnected) {
            this.initializeMask();
        }
    }

    /** @internal */
    public override handleTextInput(): void {
        this.updatingValueFromControl = true;
        super.handleTextInput();
        this.updatingValueFromControl = false;
    }

    /** @internal */
    public override valueChanged(previous: string, next: string): void {
        if (
            !this.maskOptions
            || this.updatingValueFromControl
            || this.normalizingValue
        ) {
            super.valueChanged(previous, next);
            return;
        }

        const maskedValue = maskitoTransform(next, this.maskOptions);
        if (maskedValue !== next) {
            this.normalizingValue = true;
            this.value = maskedValue;
            this.normalizingValue = false;
        } else {
            super.valueChanged(previous, next);
        }

        if (this.$fastController.isConnected) {
            this.control.value = maskedValue;
            this.createMask();
        }
    }

    private initializeMask(): void {
        this.destroyMask();
        if (!this.maskOptions) {
            return;
        }

        const maskedValue = maskitoTransform(this.value, this.maskOptions);
        if (maskedValue !== this.value) {
            this.value = maskedValue;
            return;
        }

        this.control.value = maskedValue;
        this.createMask();
    }

    private createMask(): void {
        this.destroyMask();
        if (this.maskOptions) {
            this.maskito = new Maskito(this.control, this.maskOptions);
        }
    }

    private destroyMask(): void {
        this.maskito?.destroy();
        this.maskito = undefined;
    }
}

const okFvTextField = FvTextField.compose<TextFieldOptions>({
    baseName: 'fv-text-field',
    baseClass: NimbleTextField,
    template,
    styles,
    shadowOptions: {
        delegatesFocus: true
    },
    end: html<FvTextField>`
        <${iconExclamationMarkTag}
            severity="error"
            class="error-icon"
        ></${iconExclamationMarkTag}>
        <span part="actions">
            <slot name="actions"></slot>
        </span>
        ${errorTextTemplate}
    `
});

DesignSystem.getOrCreate().withPrefix('ok').register(okFvTextField());
export const fvTextFieldTag = 'ok-fv-text-field';