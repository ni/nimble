import { Directive, HostBinding, Input } from '@angular/core';

/**
 * Directive for Angular integration for the theme provider
 */
@Directive({
    selector: 'nimble-theme-provider'
})
export class NimbleThemeProviderDirective {
    @HostBinding('attr.theme') @Input() public theme: string;
}
