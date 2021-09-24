import {
    treeViewTemplate as template,
    TreeView as FoundationTreeView,
    DesignSystem
} from '@microsoft/fast-foundation';
import { TreeItem } from '../tree-item';
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
        super.disconnectedCallback();
        this.removeEventListener(
            'selected-change',
            this.handleTreeItemSelected
        );
    }

    /**
     * This handler keeps the TreeView from deselecting a selected item when a parent TreeItem is expanded/collapsed
     * @param event The 'selected-change' event emitted by a TreeItem
     */
    private readonly handleTreeItemSelected = (event: CustomEvent): void => {
        if (
            event.target instanceof TreeItem
            && event.target.childElementCount > 0
        ) {
            const selectedTreeItem = this.querySelector<TreeItem>('[pinned-selected]');
            if (selectedTreeItem) {
                selectedTreeItem.selected = true;
                this.currentSelected = selectedTreeItem;
            }
        }
    };
}

const nimbleTreeView = TreeView.compose({
    baseName: 'tree-view',
    template,
    styles
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleTreeView());
