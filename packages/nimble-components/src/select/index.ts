import {
    DesignSystem,
    Select as FoundationSelect,
    SelectOptions,
    selectTemplate as template
} from '@microsoft/fast-foundation';
import { arrowExpanderDown16X16 } from '@ni/nimble-tokens/dist/icons/js';
import { styles } from './styles';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-select': Select;
    }
}

/**
 * A nimble-styed HTML select
 */
export class Select extends FoundationSelect {
    // Workaround for https://github.com/microsoft/fast/issues/5123
    public override setPositioning(): void {
        if (!this.$fastController.isConnected) {
            // Don't call setPositioning() until we're connected,
            // since this.forcedPosition isn't initialized yet.
            return;
        }
        super.setPositioning();
        this.updateListboxMaxHeightCSSVariable();
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
        this.updateListboxMaxHeightCSSVariable();
    }

    private updateListboxMaxHeightCSSVariable(): void {
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
    indicator: arrowExpanderDown16X16.data
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleSelect());
