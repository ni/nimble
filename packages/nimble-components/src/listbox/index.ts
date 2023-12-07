import {
    DesignSystem,
    ListboxElement as FoundationListbox,
    listboxTemplate as template
} from '@microsoft/fast-foundation';
import { styles } from './styles';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-listbox': Listbox;
    }
}

/**
 * A nimble-styled HTML list box
 */
export class Listbox extends FoundationListbox {}

const nimbleListbox = Listbox.compose({
    baseName: 'listbox',
    template,
    styles
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleListbox());
export const listboxTag = DesignSystem.tagFor(Listbox);
