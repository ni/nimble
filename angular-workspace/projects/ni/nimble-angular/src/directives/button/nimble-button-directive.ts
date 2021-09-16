import { Directive, HostBinding, Input } from '@angular/core';
import { ButtonAppearance } from '@ni/nimble-components/dist/esm/button/types';
import { NimbleIcon } from '@ni/nimble-components/dist/esm/icons/types';

@Directive({
    selector: 'nimble-button'
})
export class NimbleButtonDirective {
    @HostBinding('disabled') @Input() public disabled: boolean;
    @HostBinding('appearance') @Input() public appearance: ButtonAppearance;
    @HostBinding('icon') @Input() public icon: string | NimbleIcon;
}
