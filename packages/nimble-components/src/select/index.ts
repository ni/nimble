import {
    DesignSystem,
    Select as FoundationSelect,
    SelectOptions,
    selectTemplate as template
} from '@microsoft/fast-foundation';
import { downArrow16X16 } from '@ni/nimble-tokens/dist-icons-esm/nimble-icons-inline';
import { styles } from './styles';

/**
 * A nimble-styled HTML number input
 */
type Select = FoundationSelect;

export type { Select };

const nimbleSelect = FoundationSelect.compose<SelectOptions>({
    baseName: 'select',
    template,
    styles,
    indicator: downArrow16X16.data
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleSelect());
