import { Directive, HostBinding, Input } from '@angular/core';
import { ButtonAppearance } from '@ni/nimble-components/dist/esm/button/types';

/**
 * Directive to provide Angular integration for the nimble-button.
 */
@Directive({
    selector: 'nimble-button'
})
export class NimbleButtonDirective {
    @HostBinding('disabled') @Input() public disabled: boolean;
    @HostBinding('appearance') @Input() public appearance: ButtonAppearance;
}
