import { Directive, HostBinding, Input } from '@angular/core';

@Directive({
    selector: 'nimble-tree-item'
})
export class NimbleTreeItemDirective {
    @HostBinding('attr.disabled') @Input() public disabled: boolean;
    @HostBinding('attr.selected') @Input() public selected: boolean;
    @HostBinding('attr.expanded') @Input() public expanded: boolean;

    @HostBinding('attr.aria-selected') private get ariaSelected(): boolean {
        return this.selected;
    }
}
