import {
    DesignSystem,
    Select as FoundationSelect,
    SelectOptions,
    selectTemplate as template
} from '@microsoft/fast-foundation';
import { downArrow16X16 } from '@ni/nimble-tokens/dist-icons-esm/nimble-icons-inline';
import { styles } from './styles';

export type { Select };

/**
 * A nimble-styed HTML select
 */
class Select extends FoundationSelect {
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

const nimbleSelect = Select.compose<SelectOptions>({
    baseName: 'select',
    template,
    styles,
    indicator: downArrow16X16.data
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleSelect());
