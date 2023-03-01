import {
    treeItemTemplate as template,
    TreeItem as FoundationTreeItem,
    TreeItemOptions,
    DesignSystem
} from '@microsoft/fast-foundation';
import { arrowExpanderUp16X16 } from '@ni/nimble-tokens/dist/icons/js';
import type { TreeView } from '../tree-view';
import { groupSelectedAttribute } from '../tree-view/types';
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
    private treeView: TreeView | null = null;

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
        this.removeEventListener('selected-change', this.handleSelectedChange);
        this.treeView = null;
    }

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
