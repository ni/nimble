import { Directive, HostBinding, Input } from '@angular/core';

@Directive({
    selector: 'nimble-text-field'
})
export class NimbleTextFieldDirective {
    @HostBinding('attr.disabled') @Input() public disabled: boolean;
    @HostBinding('attr.readonly') @Input() public readonly: boolean;
    @HostBinding('invalid') @Input() public invalid: boolean;
}
