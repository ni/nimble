import { Directive, HostBinding, Input } from '@angular/core';

/**
 * Directive to provide Angular integration for the tab element.
 */
@Directive({
    selector: 'nimble-tab'
})
export class NimbleTabDirective {
    @HostBinding('attr.disabled') @Input() public disabled: boolean;
}
