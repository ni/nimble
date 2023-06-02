import { attr } from '@microsoft/fast-element';
import {
    TreeItem as FoundationTreeItem,
    TreeItemOptions,
    DesignSystem,
    treeItemTemplate as template
} from '@microsoft/fast-foundation';
import { arrowExpanderUp16X16 } from '@ni/nimble-tokens/dist/icons/js';
import { styles } from './styles';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-tree-item': TreeItem;
    }
}

/**
 * A function that returns a nimble-tree-item registration for configuring the component with a DesignSystem.
 * Implements {@link @microsoft/fast-foundation#treeItemTemplate}
 *
 *
 * @public
 * @remarks
 * Generates HTML Element: \<nimble-tree-item\>
 *
 */
export class TreeItem extends FoundationTreeItem {
    /**
     * @internal
     */
    @attr({ attribute: 'group-selected', mode: 'boolean' })
    public groupSelected = false;
}

const nimbleTreeItem = TreeItem.compose<TreeItemOptions>({
    baseName: 'tree-item',
    baseClass: FoundationTreeItem,
    template,
    styles,
    expandCollapseGlyph: arrowExpanderUp16X16.data
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleTreeItem());
export const treeItemTag = DesignSystem.tagFor(TreeItem);
