import {
    treeItemTemplate as template,
    TreeItem as FoundationTreeItem,
    TreeItemOptions,
    DesignSystem
} from '@microsoft/fast-foundation';
import { arrowExpanderUp16X16 } from '@ni/nimble-tokens/dist/icons/js';
import type { TreeView } from '../tree-view';
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
    public override connectedCallback(): void {
        super.connectedCallback();
        const treeView = this.getParentTreeView();
        if (treeView && this.selected) {
            treeView.updateGroupSelectionOnRootParentTreeItem(this);
        }
    }

    /**
     * This was copied directly from the FAST TreeItem implementation
     * @returns the root tree view
     */
    private getParentTreeView(): TreeView | null {
        const parentNode: Element | null = this.parentElement!.closest("[role='tree']");
        return parentNode as TreeView;
    }
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
