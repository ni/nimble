import {
    DesignSystem,
    Select as FoundationSelect,
    SelectOptions,
    selectTemplate as template
} from '@microsoft/fast-foundation';
import { controlsArrowExpanderDown16X16 } from '@ni/nimble-tokens/dist-icons-esm/nimble-icons-inline';
import { styles } from './styles';

export type { Select };

/**
 * A nimble-styed HTML select
 */
class Select extends FoundationSelect {
    public get value(): string {
        return super.value;
    }

    public set value(value: string) {
        super.value = value;

        // Workaround for https://github.com/microsoft/fast/issues/5139
        // When the value property is set very early in the element's lifecycle (e.g. Angular value binding),
        // the options property will not be set yet. As a workaround, we mark the listbox-option element with
        // the selected attribute, which will set the initial value correctly.
        if (value !== null && this.options.length === 0) {
            const matchingOption = this.querySelector(
                `nimble-listbox-option[value="${value}"]`
            );
            if (matchingOption !== null) {
                matchingOption.setAttribute('selected', '');
            }
        }
    }

    // Workaround for https://github.com/microsoft/fast/issues/5123
    public setPositioning(): void {
        if (!this.$fastController.isConnected) {
            // Don't call setPositioning() until we're connected,
            // since this.forcedPosition isn't initialized yet.
            return;
        }
        super.setPositioning();
    }

    public connectedCallback(): void {
        super.connectedCallback();
        // Call setPositioning() after this.forcedPosition is initialized.
        this.setPositioning();
    }
}

export const nimbleSelect = Select.compose<SelectOptions>({
    baseName: 'select',
    template,
    styles,
    indicator: controlsArrowExpanderDown16X16.data
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleSelect());
