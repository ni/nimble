import {
    DesignSystem,
    ListboxOption as FoundationListboxOption,
    listboxOptionTemplate as template
} from '@microsoft/fast-foundation';
import { styles } from './styles';

/**
 * A nimble-styled HTML listbox option
 */
type ListboxOption = FoundationListboxOption;

export type { ListboxOption };

const nimbleListboxOption = FoundationListboxOption.compose({
    baseName: 'listbox-option',
    template,
    styles
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleListboxOption());
