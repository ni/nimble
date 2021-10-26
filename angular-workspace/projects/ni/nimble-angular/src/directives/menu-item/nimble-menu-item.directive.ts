import { Directive, HostBinding, Input } from '@angular/core';
/**
 * Directive to provide Angular integration for the menu.
 */
@Directive({
    selector: 'nimble-menu-item'
})
export class NimbleMenuItemDirective {
    @HostBinding('disabled') @Input() public disabled: boolean;
}
