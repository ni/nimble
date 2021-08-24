import {
    DesignSystem,
    Select as FoundationSelect,
    SelectOptions,
    selectTemplate as template
} from '@microsoft/fast-foundation';

import { styles } from './styles';

const nimbleSelect = FoundationSelect.compose<SelectOptions>({
    baseName: 'select',
    template,
    styles,
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleSelect());
