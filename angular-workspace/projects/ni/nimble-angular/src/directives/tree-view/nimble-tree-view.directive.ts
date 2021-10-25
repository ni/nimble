import { Directive, HostBinding, Input } from '@angular/core';
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
    @HostBinding('attr.selection-mode') @Input() public selectionMode: SelectionMode;
}
