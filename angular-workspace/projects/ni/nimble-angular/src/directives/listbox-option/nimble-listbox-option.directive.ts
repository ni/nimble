import { Directive, HostBinding, Input } from '@angular/core';

@Directive({
    selector: 'nimble-listbox-option'
})
export class NimbleListboxOptionDirective {
    @HostBinding('attr.disabled') @Input() public disabled: boolean;
}
