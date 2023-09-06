import { Directive, ElementRef, Input, Renderer2 } from '@angular/core';
import { type TreeView, treeViewTag } from '@ni/nimble-components/dist/esm/tree-view';
import { TreeViewSelectionMode } from '@ni/nimble-components/dist/esm/tree-view/types';

export type { TreeView };
export { treeViewTag };
export { TreeViewSelectionMode };

/**
 * Directive to provide Angular integration for the tree view.
 */
@Directive({
    selector: 'nimble-tree-view'
})
export class NimbleTreeViewDirective {
    public get selectionMode(): TreeViewSelectionMode {
        return this.elementRef.nativeElement.selectionMode;
    }

    // selectionMode property intentionally maps to the selection-mode attribute
    // eslint-disable-next-line @angular-eslint/no-input-rename
    @Input('selection-mode') public set selectionMode(value: TreeViewSelectionMode) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'selectionMode', value);
    }

    public constructor(private readonly renderer: Renderer2, private readonly elementRef: ElementRef<TreeView>) {}
}
