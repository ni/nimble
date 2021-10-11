import {
    treeItemTemplate as template,
    TreeItem as FoundationTreeItem,
    TreeItemOptions,
    DesignSystem
} from '@microsoft/fast-foundation';
import { controlsArrowExpanderUp16X16 } from '@ni/nimble-tokens/dist-icons-esm/nimble-icons-inline';
import { styles } from './styles';

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
    private readonly pinnedSelectedAttribute = 'pinned-selected';
    private readonly groupSelectedAttribute = 'group-selected';

    public connectedCallback(): void {
        super.connectedCallback();
        this.addEventListener('selected-change', this.handleItemSelected);
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
            const treeItemChild = this.querySelector('[role="treeitem"]');
            if (treeItemChild && this.selected) {
                this.handleTreeGroupSelected(event);
            } else {
                this.handleTreeLeafSelected(event);
            }
        }
    };

    private handleTreeGroupSelected(event: CustomEvent): void {
        this.expanded = !this.expanded;
        this.dispatchEvent(new CustomEvent('expanded-change'));
        this.selected = false; // do not allow tree groups to display as 'selected' the way leaf tree items can
        event.stopImmediatePropagation();
    }

    private handleTreeLeafSelected(event: CustomEvent): void {
        const treeView = this.getParentNimbleTreeNode();
        const currentPinnedSelection = treeView?.querySelector<TreeItem>(
            `[${this.pinnedSelectedAttribute}]`
        );
        if (currentPinnedSelection) {
            currentPinnedSelection.removeAttribute(
                this.pinnedSelectedAttribute
            );
        }

        const currentGroupSelection = treeView?.querySelectorAll<TreeItem>(
            `[${this.groupSelectedAttribute}]`
        );
        currentGroupSelection?.forEach(treeItem => treeItem.removeAttribute(this.groupSelectedAttribute));
        this.setGroupSelectionOnAllParentTreeItems(event.target as TreeItem);
        this.setAttribute(this.pinnedSelectedAttribute, 'true');
        this.setAttribute('selected', 'true');
    }

    private setGroupSelectionOnAllParentTreeItems(treeItem: TreeItem): void {
        const currentParent = treeItem?.parentElement as TreeItem;
        if (currentParent?.getAttribute('role') === 'treeitem') {
            currentParent.setAttribute(this.groupSelectedAttribute, 'true');
            this.setGroupSelectionOnAllParentTreeItems(currentParent);
        }
    }

    /**
     * This was copied directly from the FAST TreeItem implementation
     * @returns the root tree view
     */
    private getParentNimbleTreeNode(): HTMLElement | null {
        const parentNode: Element | null = this.parentElement!.closest("[role='tree']");
        return parentNode as HTMLElement;
    }
}

const nimbleTreeItem = TreeItem.compose<TreeItemOptions>({
    baseName: 'tree-item',
    template,
    styles,
    expandCollapseGlyph: `${controlsArrowExpanderUp16X16.data}`
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleTreeItem());
