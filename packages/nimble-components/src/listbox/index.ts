import {
    DesignSystem,
    Listbox as FoundationListbox,
    listboxTemplate as template
} from '@microsoft/fast-foundation';

import { styles } from './styles';

const nimbleListbox = FoundationListbox.compose({
    baseName: 'listbox',
    template,
    styles
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleListbox());
