import {
    DesignSystem,
    ListboxOption as FoundationListboxOption,
    listboxOptionTemplate as template
} from '@microsoft/fast-foundation';

import { styles } from './styles';

const nimbleListboxOption = FoundationListboxOption.compose({
    baseName: 'listbox-option',
    template,
    styles
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleListboxOption());
