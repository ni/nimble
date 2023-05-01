import {
    DesignSystem,
    ListboxOption as FoundationListboxOption,
    listboxOptionTemplate as template
} from '@microsoft/fast-foundation';
import { styles } from './styles';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-list-option': ListOption;
    }
}

/**
 * A nimble-styled HTML listbox option
 */
export class ListOption extends FoundationListboxOption {
    // Workaround for https://github.com/microsoft/fast/issues/5219
    public override get value(): string {
        return super.value;
    }

    public override set value(value: string) {
        // Coerce value to string
        super.value = `${value}`;

        if (this.$fastController.isConnected) {
            this.setAttribute('value', this.value);
        }
    }

    public override connectedCallback(): void {
        super.connectedCallback();
        this.setAttribute('value', this.value);
    }
}

const nimbleListOption = ListOption.compose({
    baseName: 'list-option',
    baseClass: FoundationListboxOption,
    template,
    styles
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleListOption());
export const listOptionTag = DesignSystem.tagFor(ListOption);
