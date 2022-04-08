import {
    DesignSystem,
    Combobox as FoundationCombobox,
    ComboboxOptions,
    comboboxTemplate as template
} from '@microsoft/fast-foundation';
import { arrowExpanderDown16X16 } from '@ni/nimble-tokens/dist-icons-esm/nimble-icons-inline';
import { styles } from './styles';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-combobox': Combobox;
    }
}

/**
 * A nimble-styed HTML select
 */
export class Combobox extends FoundationCombobox {
    // Workaround for https://github.com/microsoft/fast/issues/5123
    public override setPositioning(): void {
        if (!this.$fastController.isConnected) {
            // Don't call setPositioning() until we're connected,
            // since this.forcedPosition isn't initialized yet.
            return;
        }
        super.setPositioning();
    }

    public override connectedCallback(): void {
        super.connectedCallback();
        // Call setPositioning() after this.forcedPosition is initialized.
        this.setPositioning();
    }

    // Workaround for https://github.com/microsoft/fast/issues/5773
    public override slottedOptionsChanged(
        prev: Element[],
        next: HTMLElement[]
    ): void {
        const value = this.value;
        super.slottedOptionsChanged(prev, next);
        if (value) {
            this.value = value;
        }
    }
}

const nimbleCombobox = Combobox.compose<ComboboxOptions>({
    baseName: 'combobox',
    baseClass: FoundationCombobox,
    template,
    styles,
    indicator: arrowExpanderDown16X16.data
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleCombobox());
