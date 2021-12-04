import { Directive, ElementRef, Input, Renderer2 } from '@angular/core';
import { TreeView } from '@ni/nimble-components/dist/esm/tree-view';
import { SelectionMode } from '@ni/nimble-components/dist/esm/tree-view/types';

export type { TreeView };
export { SelectionMode };

/**
 * Directive to provide Angular integration for the tree view.
 */
@Directive({
    selector: 'nimble-tree-view'
})
export class NimbleTreeViewDirective {
    public get selectionMode(): SelectionMode {
        return this.elementRef.nativeElement.selectionMode;
    }

    @Input() public set selectionMode(value: SelectionMode) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'selectionMode', value);
    }

    public constructor(private readonly renderer: Renderer2, private readonly elementRef: ElementRef<TreeView>) {}
}
