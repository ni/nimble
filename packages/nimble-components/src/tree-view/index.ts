import { attr, observable } from '@microsoft/fast-element';
import {
    TreeView as FoundationTreeView,
    DesignSystem,
    isTreeItemElement
} from '@microsoft/fast-foundation';
import { TreeItem } from '../tree-item';
import { styles } from './styles';
import { template } from './template';
import { TreeViewSelectionMode } from './types';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-tree-view': TreeView;
    }
}

/**
 * A function that returns a nimble-tree-view registration for configuring the component with a DesignSystem.
 * Implements {@link @microsoft/fast-foundation#treeViewTemplate}
 *
 *
 * @public
 * @remarks
 * Generates HTML Element: \<nimble-tree-view\>
 *
 */
export class TreeView extends FoundationTreeView {
    @attr({ attribute: 'selection-mode' })
    public selectionMode: TreeViewSelectionMode = TreeViewSelectionMode.all;

    /**
     * @internal
     */
    @observable
    public selectedItems: Element[] = [];

    public override handleClick(e: Event): boolean {
        if (e.defaultPrevented) {
            // handled, do nothing
            return false;
        }

        if (!(e.target instanceof Element) || !isTreeItemElement(e.target)) {
            // not a tree item, ignore
            return true;
        }

        const item: TreeItem = e.target as TreeItem;
        if (item.disabled) {
            return false;
        }

        if (this.canSelect(item)) {
            item.selected = true;
        } else if (this.itemHasChildren(item)) {
            item.expanded = !item.expanded;
        }
        return true;
    }

    private canSelect(item: TreeItem): boolean {
        switch (this.selectionMode) {
            case TreeViewSelectionMode.all:
                return true;
            case TreeViewSelectionMode.none:
                return false;
            case TreeViewSelectionMode.leavesOnly:
                return !this.itemHasChildren(item);
            default:
                return true;
        }
    }

    private itemHasChildren(item: TreeItem): boolean {
        const treeItemChild = item.querySelector('[role="treeitem"]');
        return treeItemChild !== null;
    }

    private selectedItemsChanged(): void {
        for (let i = 0; i < this.childElementCount; i++) {
            const item = this.children[i]!;
            if (item instanceof TreeItem) {
                item.groupSelected = false;
            }
        }

        for (let item of this.selectedItems) {
            while (item.parentElement !== null && item.parentElement !== this) {
                item = item.parentElement;
            }
            if (item instanceof TreeItem) {
                item.groupSelected = true;
            }
        }
    }
}

const nimbleTreeView = TreeView.compose({
    baseName: 'tree-view',
    baseClass: FoundationTreeView,
    template,
    styles
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleTreeView());
export const treeViewTag = DesignSystem.tagFor(TreeView);
