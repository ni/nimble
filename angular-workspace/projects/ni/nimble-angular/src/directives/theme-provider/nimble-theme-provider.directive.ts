import { Directive, ElementRef, Input, Renderer2 } from '@angular/core';
import type { NimbleThemeProvider } from '@ni/nimble-components/dist/esm/theme-provider';
import type { NimbleThemeAttribute } from '@ni/nimble-components/dist/esm/theme-provider/types';
import { NimbleTheme } from '@ni/nimble-components/dist/esm/theme-provider/types';

export type { NimbleThemeProvider };
export { NimbleTheme };

/**
 * Directive for Angular integration for the theme provider
 */
@Directive({
    selector: 'nimble-theme-provider'
})
export class NimbleThemeProviderDirective {
    public get theme(): NimbleTheme {
        return this.elementRef.nativeElement.theme;
    }

    @Input() public set theme(value: NimbleTheme | NimbleThemeAttribute) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'theme', value);
    }

    public constructor(private readonly renderer: Renderer2, private readonly elementRef: ElementRef<NimbleThemeProvider>) {}
}
