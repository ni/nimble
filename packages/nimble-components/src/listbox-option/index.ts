import {
    DesignSystem,
    ListboxOption as FoundationListboxOption,
    listboxOptionTemplate as template
} from '@microsoft/fast-foundation';
import { styles } from './styles';

export type { ListboxOption };

/**
 * A nimble-styled HTML listbox option
 */
class ListboxOption extends FoundationListboxOption {
    // Workaround for https://github.com/microsoft/fast/issues/5219
    public get value(): string {
        return super.value;
    }

    public set value(value: string) {
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

const nimbleListboxOption = ListboxOption.compose({
    baseName: 'listbox-option',
    template,
    styles
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleListboxOption());
