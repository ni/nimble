import {
    DesignSystem,
    Select as FoundationSelect,
    SelectOptions,
    selectTemplate as template
} from '@microsoft/fast-foundation';
import { arrowExpanderDown16X16 } from '@ni/nimble-tokens/dist-icons-esm/nimble-icons-inline';
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
    public override get value(): string {
        return super.value;
    }

    public override set value(value: string) {
        super.value = value;

        // Workaround for https://github.com/microsoft/fast/issues/5139
        // When the value property is set very early in the element's lifecycle (e.g. Angular value binding),
        // the options property will not be set yet. As a workaround, we mark the listbox-option element with
        // the selected attribute, which will set the initial value correctly.
        if (value !== null && this.options.length === 0) {
            const options = this.querySelectorAll('option,[role="option"]');
            options.forEach(option => {
                if (option.getAttribute('value') === value) {
                    option.setAttribute('selected', '');
                }
            });
        }
    }

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
}

const nimbleSelect = Select.compose<SelectOptions>({
    baseName: 'select',
    baseClass: FoundationSelect,
    template,
    styles,
    indicator: arrowExpanderDown16X16.data
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleSelect());
