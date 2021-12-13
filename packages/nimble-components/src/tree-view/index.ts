import { attr } from '@microsoft/fast-element';
import {
    treeViewTemplate as template,
    TreeView as FoundationTreeView,
    DesignSystem
} from '@microsoft/fast-foundation';
import { styles } from './styles';
import { TreeViewSelectionMode } from './types';

export type { TreeView };

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
class TreeView extends FoundationTreeView {
    @attr({ attribute: 'selection-mode' })
    public selectionMode: TreeViewSelectionMode;

    public connectedCallback(): void {
        super.connectedCallback();
        if (!this.selectionMode) {
            this.selectionMode = TreeViewSelectionMode.All;
        }
    }
}

const nimbleTreeView = TreeView.compose({
    baseName: 'tree-view',
    baseClass: FoundationTreeView,
    template,
    styles
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleTreeView());
