import { Directive, ElementRef, EventEmitter, HostBinding, HostListener, Input, Output } from '@angular/core';
import { TreeItem } from '@ni/nimble-components/dist/esm/tree-item';
import { TreeView } from '@ni/nimble-components/dist/esm/tree-view';
import { SelectionMode } from '@ni/nimble-components/dist/esm/tree-view/types';

export type { TreeView };

/**
 * Directive to provide Angular integration for the tree view.
 */
@Directive({
    selector: 'nimble-tree-view'
})
export class NimbleTreeViewDirective {
    @HostBinding('attr.selection-mode') @Input() public selectionMode: SelectionMode | undefined;
    @Output() public selectedChange = new EventEmitter<TreeItem>();

    public constructor(private readonly treeViewReference: ElementRef<TreeView>) {
    }

    @HostListener('selected-change', ['$event'])
    private onSelectedChange($event: Event): void {
        const selectedTreeItem = $event.target as TreeItem;
        this.selectedChange.emit(selectedTreeItem);
    }
}
