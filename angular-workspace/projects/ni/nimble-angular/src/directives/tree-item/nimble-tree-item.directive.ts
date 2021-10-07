import { Directive, ElementRef, EventEmitter, HostBinding, HostListener, Input, Output } from '@angular/core';
import { TreeItem } from '@ni/nimble-components/dist/esm/tree-item';

/**
 * Directive to provide Angular integration for the tree item.
 */
@Directive({
    selector: 'nimble-tree-item'
})
export class NimbleTreeItemDirective {
    @HostBinding('disabled') @Input() public disabled: boolean;
    @HostBinding('expanded') @Input() public expanded: boolean;
    @HostBinding('selected')
    @HostBinding('attr.aria-selected') // Needed because fast-foundation TreeView sets initial selection with an aria-selected query
    @Input() public selected: boolean;

    @Output() public selectedChange = new EventEmitter<boolean>();
    @Output() public expandedChange = new EventEmitter<boolean>();

    public constructor(private readonly treeItemReference: ElementRef<TreeItem>) {
    }

    @HostListener('selected-change', ['$event'])
    private onSelectedChange($event: Event): void {
        const treeItemElement = this.treeItemReference.nativeElement;
        if ($event.target === treeItemElement) {
            this.selected = treeItemElement.selected;
            this.selectedChange.emit(this.selected);
        }
    }

    @HostListener('expanded-change', ['$event'])
    private onExpandedChange($event: Event): void {
        const treeItemElement = this.treeItemReference.nativeElement;
        if ($event.target === treeItemElement) {
            this.expanded = treeItemElement.expanded;
            this.expandedChange.emit(treeItemElement.expanded);
        }
    }
}
