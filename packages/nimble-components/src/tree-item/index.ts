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

    public connectedCallback(): void {
        super.connectedCallback();
        this.addEventListener('selected-change', this.handleSelectedChange);
        this.treeView = this.getParentTreeView();
        if (this.treeView && this.selected) {
            this.setGroupSelectionOnRootParentTreeItem(this);
        }
    }

    public disconnectedCallback(): void {
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

        const leavesOnly = this.treeView?.selectionMode === SelectionMode.LeavesOnly;
        const hasChildren = this.hasChildTreeItems();
        if ((leavesOnly && !hasChildren) || !leavesOnly) {
            // if either a leaf tree item, or in a mode that supports select on groups,
            // process click as a select
            if (!this.selected) {
                // if already selected, prevent base-class from issuing selected-change event
                this.selected = true;
                this.$emit('selected-change', this);
            }

            event.stopImmediatePropagation();
        } else {
            // implicit hasChildren && leavesOnly, so only allow expand/collapse, not select
            this.expanded = !this.expanded;
            this.$emit('expanded-change', this);

            // don't allow base class to process click event, as all we want to happen
            // here is toggling 'expanded', and to issue the expanded-change event
            event.stopImmediatePropagation();
        }
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
    styles,
    expandCollapseGlyph: controlsArrowExpanderUp16X16.data
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleTreeItem());
