import { Directive, Input } from '@angular/core';

@Directive({
    selector: 'nimble-select',
})
/**
 * Directive for Nimble select control Angular integration
 */
export class NimbleSelectDirective {
    @Input() public disabled: boolean;
}
