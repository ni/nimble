import {
    DesignSystem,
    ListboxElement as FoundationListbox,
    listboxTemplate as template
} from '@microsoft/fast-foundation';
import { styles } from './styles';

export const listboxTag = 'nimble-listbox';
declare global {
    interface HTMLElementTagNameMap {
        [listboxTag]: Listbox;
    }
}

/**
 * A nimble-styled HTML list box
 */
export class Listbox extends FoundationListbox {}

const nimbleListbox = Listbox.compose({
    baseName: listboxTag,
    template,
    styles
});

DesignSystem.getOrCreate().register(nimbleListbox());
