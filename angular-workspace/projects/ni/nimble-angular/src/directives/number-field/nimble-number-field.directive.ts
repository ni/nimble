import { Directive, HostBinding, Input } from '@angular/core';

/**
 * Directive to provide Angular integration for the nimble-number-field.
 */
@Directive({
    selector: 'nimble-number-field'
})
export class NimbleNumberFieldDirective {
    @HostBinding('attr.readonly') @Input() public readonly: boolean;
    @HostBinding('attr.min') @Input() public min: number;
    @HostBinding('attr.max') @Input() public max: number;
    @HostBinding('attr.step') @Input() public step: number;
    @HostBinding('attr.placeholder') @Input() public placeholder: string;
}
