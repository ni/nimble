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

    private readonly handleItemSelected = (event: CustomEvent): void => {
        // this handler will be called for every TreeItem from the target to the root as the 'selected-change' bubbles up
        if (event.target === this) {
            this.expanded = !this.expanded;
            if (this.childElementCount > 0 && this.selected) {
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
