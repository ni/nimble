import {
    DesignSystem,
    ListboxElement as FoundationListbox,
    listboxTemplate as template
} from '@microsoft/fast-foundation';
import { styles } from './styles';

const baseName = 'listbox';
export const listboxTag = `nimble-${baseName}`;
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
    baseName,
    template,
    styles
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleListbox());
