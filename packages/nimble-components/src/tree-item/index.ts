import {
    treeItemTemplate as template,
    TreeItem as FoundationTreeItem,
    TreeItemOptions,
    DesignSystem
} from '@microsoft/fast-foundation';
import { arrowExpanderUp16X16 } from '@ni/nimble-tokens/dist-icons-esm/nimble-icons-inline';
import type { TreeView } from '../tree-view';
import {
    groupSelectedAttribute,
    TreeViewSelectionMode
} from '../tree-view/types';
import { styles } from './styles';

export type { TreeItem };

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
class TreeItem extends FoundationTreeItem {
    private treeView: TreeView | null = null;

    public constructor() {
        super();
        this.addEventListener('click', this.handleClickOverride);
    }

    public override connectedCallback(): void {
        super.connectedCallback();
        this.addEventListener('selected-change', this.handleSelectedChange);
        this.treeView = this.getParentTreeView();
        if (this.treeView && this.selected) {
            this.setGroupSelectionOnRootParentTreeItem(this);
        }
    }

    public override disconnectedCallback(): void {
        super.disconnectedCallback();
        this.removeEventListener('click', this.handleClickOverride);
        this.removeEventListener('selected-change', this.handleSelectedChange);
        this.treeView = null;
    }

    private hasChildTreeItems(): boolean {
        const treeItemChild = this.querySelector('[role="treeitem"]');
        return treeItemChild !== null;
    }

    private readonly handleClickOverride = (event: MouseEvent): void => {
        if (event.composedPath().includes(this.expandCollapseButton)) {
            // just have base class handle click event for glyph
            return;
        }

        const treeItem = this.getImmediateTreeItem(event.target as HTMLElement);
        if (treeItem?.disabled || treeItem !== this) {
            // don't allow base TreeItem to emit a 'selected-change' event when a disabled item is clicked
            event.stopImmediatePropagation();
            return;
        }

        const leavesOnly = this.treeView?.selectionMode === TreeViewSelectionMode.LeavesOnly;
        const hasChildren = this.hasChildTreeItems();
        if ((leavesOnly && !hasChildren) || !leavesOnly) {
            // if either a leaf tree item, or in a mode that supports select on groups,
            // process click as a select
            if (
                this.treeView?.currentSelected instanceof FoundationTreeItem
                && this !== this.treeView?.currentSelected
            ) {
                this.treeView.currentSelected.selected = false;
            }

            this.selected = true;
        } else {
            // implicit hasChildren && leavesOnly, so only allow expand/collapse, not select
            this.expanded = !this.expanded;
        }

        // don't allow base class to process click event
        event.stopImmediatePropagation();
    };

    // This prevents the toggling of selected state when a TreeItem is clicked multiple times,
    // which is what the FAST TreeItem allows
    private readonly handleSelectedChange = (event: Event): void => {
        // only process selection
        if (event.target === this && this.selected) {
            this.setGroupSelectionOnRootParentTreeItem(this);
        }
    };

    private clearTreeGroupSelection(): void {
        const currentGroupSelection = this.treeView?.querySelectorAll<TreeItem>(
            `[${groupSelectedAttribute}]`
        );
        currentGroupSelection?.forEach(treeItem => treeItem.removeAttribute(groupSelectedAttribute));
    }

    private setGroupSelectionOnRootParentTreeItem(treeItem: HTMLElement): void {
        this.clearTreeGroupSelection();

        let currentItem: HTMLElement | null | undefined = treeItem;
        while (currentItem?.parentElement !== this.treeView) {
            currentItem = currentItem?.parentElement;
        }

        if (currentItem) {
            currentItem.setAttribute(groupSelectedAttribute, 'true');
        }
    }

    private getImmediateTreeItem(element: HTMLElement): TreeItem {
        let foundElement: HTMLElement | null | undefined = element;
        while (
            foundElement
            && !(foundElement?.getAttribute('role') === 'treeitem')
        ) {
            foundElement = foundElement?.parentElement;
        }

        return foundElement as TreeItem;
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
    // @ts-expect-error FAST styles have incorrect type, see: https://github.com/microsoft/fast/issues/5047
    styles,
    expandCollapseGlyph: arrowExpanderUp16X16.data
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleTreeItem());
