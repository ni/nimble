import { Directive, Input } from '@angular/core';

@Directive({
    selector: 'nimble-select'
})
export class NimbleSelectDirective {
    @Input() public disabled: boolean;
}
