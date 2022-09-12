import { attr, html } from '@microsoft/fast-element';
import {
    DesignSystem,
    Select as FoundationSelect,
    SelectOptions,
    selectTemplate as template
} from '@microsoft/fast-foundation';
import { arrowExpanderDown16X16 } from '@ni/nimble-tokens/dist/icons/js';
import { styles } from './styles';
import { DropdownAppearance } from '../patterns/dropdown/types';
import '../icons/exclamation-mark';
import { errorTextTemplate } from '../patterns/error/template';
import type { IHasErrorText } from '../patterns/error/types';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-select': Select;
    }
}

/**
 * A nimble-styled HTML select
 */
export class Select extends FoundationSelect implements IHasErrorText {
    @attr
    public appearance: DropdownAppearance = DropdownAppearance.underline;

    /**
     * A message explaining why the value is invalid.
     *
     * @public
     * @remarks
     * HTML Attribute: error-text
     */
    @attr({ attribute: 'error-text' })
    public errorText: string | undefined;

    // Workaround for https://github.com/microsoft/fast/issues/5123
    public override setPositioning(): void {
        if (!this.$fastController.isConnected) {
            // Don't call setPositioning() until we're connected,
            // since this.forcedPosition isn't initialized yet.
            return;
        }
        super.setPositioning();
        this.updateListboxMaxHeightCssVariable();
    }

    // Workaround for https://github.com/microsoft/fast/issues/5773
    public override slottedOptionsChanged(
        prev: Element[],
        next: Element[]
    ): void {
        const value = this.value;
        super.slottedOptionsChanged(prev, next);
        if (value) {
            this.value = value;
        }
    }

    private maxHeightChanged(): void {
        this.updateListboxMaxHeightCssVariable();
    }

    private updateListboxMaxHeightCssVariable(): void {
        if (this.listbox) {
            this.listbox.style.setProperty(
                '--ni-private-select-max-height',
                `${this.maxHeight}px`
            );
        }
    }
}

const nimbleSelect = Select.compose<SelectOptions>({
    baseName: 'select',
    baseClass: FoundationSelect,
    template,
    styles,
    indicator: arrowExpanderDown16X16.data,
    end: html<Select>`
        <nimble-icon-exclamation-mark
            class="error-icon fail"
        ></nimble-icon-exclamation-mark>
        ${errorTextTemplate}
    `
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleSelect());
