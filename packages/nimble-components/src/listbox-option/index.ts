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
    public get value(): string {
        return super.value;
    }

    public set value(value: string) {
        // Coerce value to string
        super.value = `${value}`;

        if (this.$fastController.isConnected) {
            this.reflectValueAttributeIfUnset();
        }
    }

    public override connectedCallback(): void {
        super.connectedCallback();
        this.reflectValueAttributeIfUnset();
    }

    private reflectValueAttributeIfUnset(): void {
        if (
            typeof this.value === 'string'
            && this.value.length !== 0
            && this.getAttribute('value') === null
        ) {
            this.setAttribute('value', this.value);
        }
    }
}

const nimbleListboxOption = ListboxOption.compose({
    baseName: 'listbox-option',
    template,
    styles
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleListboxOption());
