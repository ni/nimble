import { attr } from '@microsoft/fast-element';
import {
    treeViewTemplate as template,
    TreeView as FoundationTreeView,
    DesignSystem,
    isTreeItemElement,
    TreeItem
} from '@microsoft/fast-foundation';
import { styles } from './styles';
import {
    groupSelectedAttribute,
    ISelectable,
    TreeViewSelectionMode
} from './types';

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

    private readonly groupSelectedItems: { item: HTMLElement, count: number }[] = [];

    public constructor() {
        super();
        this.addEventListener('selected-change', event => this.onSelectedChange(event));
    }

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

    /**
     * @internal
     */
    public updateGroupSelectionOnRootParentTreeItem(treeItem: ISelectable): void {
        let currentItem: HTMLElement | null | undefined = treeItem;
        while (
            currentItem?.parentElement !== this
            && currentItem?.parentElement !== null
        ) {
            currentItem = currentItem?.parentElement;
        }

        if (currentItem) {
            const foundIndex = this.groupSelectedItems.findIndex(x => x.item === currentItem);
            if (foundIndex !== -1) {
                const record = this.groupSelectedItems[foundIndex];
                record!.count += treeItem.selected ? 1 : -1;
                if (record!.count === 0) {
                    this.groupSelectedItems.splice(foundIndex, 1);
                    currentItem.removeAttribute(groupSelectedAttribute);
                } else if (record!.count < 0) {
                    throw new Error('Negative ref count in record');
                }
            } else {
                if (!treeItem.selected) {
                    throw new Error('Should have found record for previously selected group');
                }
                this.groupSelectedItems.push({ item: currentItem, count: 1 });
                currentItem.setAttribute(groupSelectedAttribute, 'true');
            }
        }
    }

    // This prevents the toggling of selected state when a TreeItem is clicked multiple times,
    // which is what the FAST TreeItem allows
    private onSelectedChange(event: Event): void {
        this.updateGroupSelectionOnRootParentTreeItem(event.target as ISelectable);
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
}

const nimbleTreeView = TreeView.compose({
    baseName: 'tree-view',
    baseClass: FoundationTreeView,
    template,
    styles
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleTreeView());
export const treeViewTag = DesignSystem.tagFor(TreeView);
