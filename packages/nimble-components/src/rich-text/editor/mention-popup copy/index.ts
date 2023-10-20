import {
    DesignSystem,
    ListboxElement,
    listboxTemplate as template
} from '@microsoft/fast-foundation';
import { styles } from './styles';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-list-box': ListboxElement;
    }
}

/**
 * A nimble styled Mention Box
 */
// export class ListBox extends ListboxElement {
// }

const nimbleListBox = ListboxElement.compose({
    baseName: 'list-box',
    template,
    styles
});

DesignSystem.getOrCreate()
    .withPrefix('nimble')
    .register(nimbleListBox());
export const listBoxTag = DesignSystem.tagFor(ListboxElement);
