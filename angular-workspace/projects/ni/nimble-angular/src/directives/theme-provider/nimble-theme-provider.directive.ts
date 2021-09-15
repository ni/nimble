import { Directive, HostBinding, Input } from '@angular/core';

@Directive({
    selector: 'nimble-theme-provider'
})
export class NimbleThemeProviderDirective {
    @HostBinding('attr.theme') @Input() public theme: string;
}
