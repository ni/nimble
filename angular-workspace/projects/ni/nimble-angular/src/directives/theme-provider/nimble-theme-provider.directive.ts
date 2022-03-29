import { Directive, ElementRef, Input, Renderer2 } from '@angular/core';
import type { ThemeProvider } from '@ni/nimble-components/dist/esm/theme-provider';
import type { ThemeAttribute } from '@ni/nimble-components/dist/esm/theme-provider/types';
import { Theme } from '@ni/nimble-components/dist/esm/theme-provider/types';

export type { ThemeProvider };
export { Theme };

/**
 * Directive for Angular integration for the theme provider
 */
@Directive({
    selector: 'nimble-theme-provider'
})
export class NimbleThemeProviderDirective {
    public get theme(): ThemeAttribute {
        return this.elementRef.nativeElement.theme;
    }

    @Input() public set theme(value: Theme | ThemeAttribute) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'theme', value);
    }

    public constructor(private readonly renderer: Renderer2, private readonly elementRef: ElementRef<ThemeProvider>) {}
}
