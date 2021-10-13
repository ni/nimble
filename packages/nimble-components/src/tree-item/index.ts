import {
    treeItemTemplate as template,
    TreeItem as FoundationTreeItem,
    TreeItemOptions,
    DesignSystem
} from '@microsoft/fast-foundation';
import { controlsArrowExpanderUp16X16 } from '@ni/nimble-tokens/dist-icons-esm/nimble-icons-inline';
import type { TreeView } from '../tree-view';
import { styles } from './styles';
import { pinnedSelectedAttribute, groupSelectedAttribute } from './types';

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

    public connectedCallback(): void {
        super.connectedCallback();
        this.addEventListener('selected-change', this.handleItemSelected);
        if (this.selected) {
            this.setGroupSelectionOnRootParentTreeItem(this);
        }
    }

    public disconnectedCallback(): void {
        super.disconnectedCallback();
        this.removeEventListener('selected-change', this.handleItemSelected);
    }

    /**
     * We are modifying the built-in behavior of selected state of the FAST TreeItem, as well as what initiates expand/
     * collapse. By default, we will not allow tree items that have sub tree items to be selected (and thus render as such).
     * In addition, clicking anywhere on a tree item with children (not just the expand/collapse icon) will initiate
     * expand/collapse.
     *
     * The 'pinned-selected' attribute is set so that the Nimble TreeView can leverage it to manage the current selection
     * correctly when a parent group is expanded/collapsed.
     * @param event The 'selected-change' event emitted by the FAST TreeItem
     */
    private readonly handleItemSelected = (event: CustomEvent): void => {
        // this handler will be called for every TreeItem from the target to the root as the 'selected-change' bubbles up
        if (event.target === this) {
            if (this.hasChildren() && this.selected) {
                this.handleTreeGroupSelected(event);
            } else {
                this.handleTreeLeafSelected(event);
            }
        }
    };

    private hasChildren(): boolean {
        const treeItemChild = this.querySelector('[role="treeitem"]');
        return treeItemChild !== null;
    }

    private clearTreeGroupSelection(treeView: TreeView): void {
        const currentGroupSelection = treeView?.querySelectorAll<TreeItem>(
            `[${groupSelectedAttribute}]`
        );
        currentGroupSelection?.forEach(treeItem => treeItem.removeAttribute(groupSelectedAttribute));
    }

    private clearTreeItemSelection(treeView: TreeView): void {
        const currentPinnedSelection = treeView?.querySelectorAll<TreeItem>(
            `[${pinnedSelectedAttribute}]`
        );
        currentPinnedSelection?.forEach(treeItem => treeItem.removeAttribute(pinnedSelectedAttribute));

        const currentSelection = treeView?.querySelectorAll<TreeItem>(`[selected]`);
        currentSelection.forEach(treeItem => treeItem.removeAttribute('selected'));
        if (currentSelection.length > 1) {
            console.info("NOTICE: The TreeView had an invalid selection state. The current state should now be valid.")
        }
    }

    private handleTreeGroupSelected(event: CustomEvent): void {
        this.expanded = !this.expanded;
        this.dispatchEvent(new CustomEvent('expanded-change'));
        this.selected = false; // do not allow tree groups to display as 'selected' the way leaf tree items can
        event.stopImmediatePropagation();
    }

    private handleTreeLeafSelected(event: CustomEvent): void {
        const treeView = this.getParentNimbleTreeNode()!;
        this.clearTreeItemSelection(treeView);
        this.clearTreeGroupSelection(treeView);
        this.setGroupSelectionOnRootParentTreeItem(event.target as TreeItem);
        this.setAttribute(pinnedSelectedAttribute, 'true');
        this.selected = true;    
    }

    private setGroupSelectionOnRootParentTreeItem(treeItem: TreeItem): void {
        let currentParent = treeItem?.parentElement as TreeItem;
        while (currentParent?.parentElement?.getAttribute('role') !== 'tree') {
            currentParent = currentParent.parentElement as TreeItem;
        }

        if (currentParent) {
            currentParent.setAttribute(groupSelectedAttribute, 'true');
        }
    }

    /**
     * This was copied directly from the FAST TreeItem implementation
     * @returns the root tree view
     */
    private getParentNimbleTreeNode(): TreeView | null {
        const parentNode: Element | null = this.parentElement!.closest("[role='tree']");
        return parentNode as TreeView;
    }
}

const nimbleTreeItem = TreeItem.compose<TreeItemOptions>({
    baseName: 'tree-item',
    baseClass: FoundationTreeItem,
    template,
    styles,
    expandCollapseGlyph: `${controlsArrowExpanderUp16X16.data}`
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleTreeItem());
