import { Directive, HostBinding, Input } from '@angular/core';
import { ButtonAppearance } from '@ni/nimble-components/dist/esm/button/types';

@Directive({
    selector: 'nimble-button'
})
export class NimbleButtonDirective {
    @HostBinding('attr.disabled') @Input() public disabled: boolean;
    @HostBinding('appearance') @Input() public appearance: ButtonAppearance;
}
