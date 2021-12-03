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
        return this.el.nativeElement.selectionMode;
    }

    @Input() public set selectionMode(value: SelectionMode) {
        this.renderer.setProperty(this.el.nativeElement, 'selectionMode', value);
    }

    public constructor(private readonly renderer: Renderer2, private readonly el: ElementRef<TreeView>) {}
}
