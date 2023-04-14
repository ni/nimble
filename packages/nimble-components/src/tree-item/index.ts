import { Notifier, observable, Observable } from '@microsoft/fast-element';
import {
    TreeItem as FoundationTreeItem,
    TreeItemOptions,
    DesignSystem
} from '@microsoft/fast-foundation';
import { arrowExpanderUp16X16 } from '@ni/nimble-tokens/dist/icons/js';
import type { ISelectableSubtree } from '../tree-view/types';
import { styles } from './styles';
import { template } from './template';

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
export class TreeItem extends FoundationTreeItem implements ISelectableSubtree {
    /**
     * @internal
     */
    @observable
    public subtreeHasSelection = false;

    private childNotifiers: Notifier[] = [];

    public override connectedCallback(): void {
        super.connectedCallback();
        this.observeChildren();
        this.addEventListener('selected-change', () => this.onSelectedChange());
    }

    /**
     * @internal
     */
    public handleChange(_source: unknown, _args: unknown): void {
        this.updateSubtreeHasSelection();
    }

    /**
     * @internal
     */
    public childItemsChanged(): void {
        this.observeChildren();
        this.updateSubtreeHasSelection();
    }

    /**
     * @internal
     */
    public isGroupSelected(): boolean {
        return (
            this.parentElement?.closest("[role='tree']")
                === this.parentElement && this.subtreeHasSelection
        );
    }

    private onSelectedChange(): void {
        this.updateSubtreeHasSelection();
    }

    private updateSubtreeHasSelection(): void {
        this.subtreeHasSelection = this.selected
            || (this.childItems !== undefined
                && !!this.childItems.find(
                    x => (x as ISelectableSubtree).subtreeHasSelection
                ));
    }

    private observeChildren(): void {
        this.removeChildObservers();

        for (const child of this.childItems) {
            const notifier = Observable.getNotifier(child);
            notifier.subscribe(this, 'subtreeHasSelection');
            this.childNotifiers.push(notifier);
        }
    }

    private removeChildObservers(): void {
        this.childNotifiers.forEach(notifier => {
            notifier.unsubscribe(this);
        });
        this.childNotifiers = [];
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
