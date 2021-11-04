import { Directive, HostBinding, Input } from '@angular/core';
import { NimbleTheme } from '@ni/nimble-components/dist/esm/theme-provider/themes'

export { NimbleTheme };

/**
 * Directive for Angular integration for the theme provider
 */
@Directive({
    selector: 'nimble-theme-provider'
})
export class NimbleThemeProviderDirective {
    @HostBinding('attr.theme') @Input() public theme: string;
}
