import { attr, customElement } from '@ni/fast-element';
import {
    TreeItem as FoundationTreeItem,
    treeItemTemplate as template
} from '@ni/fast-foundation';
import { arrowExpanderUp16X16 } from '@ni/nimble-tokens/dist/icons/js';
import { styles } from './styles';
import { elementDefinitionContextMock } from '../utilities/models/mock';

export const treeItemTag = 'nimble-tree-item';

declare global {
    interface HTMLElementTagNameMap {
        [treeItemTag]: TreeItem;
    }
}

/**
 * A nimble-styled tree item
 */
@customElement({
    name: treeItemTag,
    template: template(elementDefinitionContextMock, {
        expandCollapseGlyph: arrowExpanderUp16X16.data
    }),
    styles
})
export class TreeItem extends FoundationTreeItem {
    /**
     * @internal
     */
    @attr({ attribute: 'group-selected', mode: 'boolean' })
    public groupSelected = false;
}
