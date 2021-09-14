import {
    treeViewTemplate as template,
    TreeView as FoundationTreeView,
    DesignSystem
} from '@microsoft/fast-foundation';
import type { TreeItem } from '../tree-item';
import { styles } from './styles';

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
    public connectedCallback(): void {
        super.connectedCallback();
        this.addEventListener('selected-change', this.handleTreeItemSelected);
    }

    public disconnectedCallback(): void {
        this.removeEventListener(
            'selected-change',
            this.handleTreeItemSelected
        );
    }

    private readonly handleTreeItemSelected = (event: CustomEvent): void => {
        const treeItem = event.target as TreeItem;
        if (treeItem && treeItem.childElementCount > 0) {
            const selectedTreeItem = this.querySelector<TreeItem>('[pinned-selected]');
            if (selectedTreeItem) {
                selectedTreeItem.selected = true;
                this.currentSelected = selectedTreeItem;
            }
        }
    };
}

export const nimbleTreeView = TreeView.compose({
    baseName: 'tree-view',
    template,
    styles
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleTreeView());
