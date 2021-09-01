import { Directive, EventEmitter, HostBinding, Input, Output } from '@angular/core';

@Directive({
    selector: 'nimble-select'
})
export class NimbleSelectDirective {
    @Output() public change = new EventEmitter<string>();
    @HostBinding('value') @Input() public value: string;
    @HostBinding('attr.disabled') @Input() public disabled: boolean;
}
