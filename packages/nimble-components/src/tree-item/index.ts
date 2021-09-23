import {
    treeItemTemplate as template,
    TreeItem as FoundationTreeItem,
    TreeItemOptions,
    DesignSystem
} from '@microsoft/fast-foundation';
import { upArrow16X16 } from '@ni/nimble-tokens/dist-icons-esm/nimble-icons-inline';
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
    public connectedCallback(): void {
        super.connectedCallback();
        this.addEventListener('selected-change', this.handleItemSelected);
    }

    public disconnectedCallback(): void {
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
            const treeItemChild = this.querySelector('nimble-tree-item');
            if (treeItemChild && this.selected) {
                this.expanded = !this.expanded;
                this.selected = false; // do not allow tree groups to display as 'selected' the way leaf tree items can
            } else {
                const treeView = this.getParentNimbleTreeNode();
                const currentPinnedSelection = treeView?.querySelector<TreeItem>('[pinned-selected]');
                if (currentPinnedSelection) {
                    currentPinnedSelection.removeAttribute('pinned-selected');
                }

                this.setAttribute('pinned-selected', 'true');
            }
        }
    };

    /**
     * This was copied directly from the FAST TreeItem implementation
     * @returns the root tree view
     */
    private getParentNimbleTreeNode(): HTMLElement | null | undefined {
        const parentNode: Element | null | undefined = this.parentElement!.closest("[role='tree']");
        return parentNode as HTMLElement;
    }
}

export const nimbleTreeItem = TreeItem.compose<TreeItemOptions>({
    baseName: 'tree-item',
    template,
    styles,
    expandCollapseGlyph: `${upArrow16X16.data}`
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleTreeItem());
