import { Directive, HostBinding, Input } from '@angular/core';

@Directive({
    selector: 'nimble-tree-item'
})
export class NimbleTreeItemDirective {
    @HostBinding('attr.disabled') @Input() public disabled: boolean;
    @HostBinding('attr.selected') @Input() public selected: boolean;
    @HostBinding('attr.expanded') @Input() public expanded: boolean;

    // The fast-foundation TreeView sets initial selection via querying for
    // aria-selected on child tree items, so we have a binding for it so that
    // initial selection state gets set up correctly on the TreeView
    @HostBinding('attr.aria-selected') private get ariaSelected(): boolean {
        return this.selected;
    }
}
