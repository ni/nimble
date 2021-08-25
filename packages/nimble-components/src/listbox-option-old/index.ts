import {
    DesignSystem,
    ListboxOption as FoundationListboxOption,
    listboxOptionTemplate as template
} from '@microsoft/fast-foundation';

import { styles } from './styles';

const nimbleSelect = FoundationListboxOption.compose({
    baseName: 'option',
    template,
    styles
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleSelect());
