import { attr, customElement, observable } from '@ni/fast-element';
import {
    TreeView as FoundationTreeView,
    isTreeItemElement
} from '@ni/fast-foundation';
import { TreeItem } from '../tree-item';
import { styles } from './styles';
import { template } from './template';
import { TreeViewSelectionMode } from './types';

export const treeViewTag = 'nimble-tree-view';

declare global {
    interface HTMLElementTagNameMap {
        [treeViewTag]: TreeView;
    }
}

/**
 * A nimble-styled tree view
 */
@customElement({
    name: treeViewTag,
    template,
    styles
})
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
        for (const item of Array.from(this.children)) {
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
