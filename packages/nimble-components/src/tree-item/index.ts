import {
    treeItemTemplate as template,
    TreeItem as FoundationTreeItem,
    TreeItemOptions,
    DesignSystem
} from '@microsoft/fast-foundation';
import { controlsArrowExpanderUp16X16 } from '@ni/nimble-tokens/dist-icons-esm/nimble-icons-inline';
import type { TreeView } from '../tree-view';
import { groupSelectedAttribute, SelectionMode } from '../tree-view/types';
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
    private treeView: TreeView | null;

    public constructor() {
        super();
        this.addEventListener('click', this.handleClickOverride);
    }

    public hasChildren(): boolean {
        const treeItemChild = this.querySelector('[role="treeitem"]');
        return treeItemChild !== null;
    }

    public connectedCallback(): void {
        super.connectedCallback();
        this.addEventListener('selected-change', this.handleSelectedChange);
        this.treeView = this.getParentNimbleTreeNode();
        if (this.treeView && this.selected) {
            this.setGroupSelectionOnRootParentTreeItem(this);
        }
    }

    public disconnectedCallback(): void {
        super.disconnectedCallback();
        this.removeEventListener('click', this.handleClickOverride);
        this.removeEventListener('selected-change', this.handleSelectedChange);
    }

    private readonly handleClickOverride = (event: MouseEvent): void => {
        // Check to see if glyph was clicked, and if it was just stopPropogation so we don't handle
        // the click event for other tree items
        const expandCollapseGlyph = this.shadowRoot?.querySelector<HTMLElement>(
            '.expand-collapse-button'
        );
        if (event.composedPath().includes(expandCollapseGlyph as EventTarget)) {
            event.stopPropagation();
            return;
        }

        const treeItem = event.target as TreeItem;
        if (treeItem?.disabled) {
            event.preventDefault();
            return;
        }

        // prettier-ignore
        if ((this.treeView?.selectionMode === SelectionMode.LeavesOnly && !this.hasChildren())
            || this.treeView?.selectionMode === SelectionMode.All) {
            this.setGroupSelectionOnRootParentTreeItem(treeItem);
        } else if (this.hasChildren()) {
            this.expanded = !this.expanded;
            this.$emit('expanded-change', this);
            event.preventDefault();
        }

        event.stopPropagation();
    };

    // This prevents the toggling of selected state when a TreeItem is clicked multiple times,
    // which is what the FAST TreeItem allows
    private readonly handleSelectedChange = (event: Event): void => {
        if (event.target === this) {
            this.selected = true;
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
    expandCollapseGlyph: controlsArrowExpanderUp16X16.data
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleTreeItem());
