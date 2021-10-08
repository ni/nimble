import { Directive, HostBinding, Input } from '@angular/core';

/**
 * Directive to provide Angular integration for the text field
 */
@Directive({
    selector: 'nimble-text-field'
})
export class NimbleTextFieldDirective {
    @HostBinding('attr.readonly') @Input() public readonly: boolean;
}
