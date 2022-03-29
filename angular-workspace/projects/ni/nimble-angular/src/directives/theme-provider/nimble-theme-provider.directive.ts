import { Directive, ElementRef, Input, Renderer2 } from '@angular/core';
import type { ThemeProvider } from '@ni/nimble-components/dist/esm/theme-provider';
import type { ThemeProviderTheme, ThemeProviderThemeProperty, ThemeProviderThemeAttribute } from '@ni/nimble-components/dist/esm/theme-provider/types';
import { Theme, ThemeProviderDerivedTheme } from '@ni/nimble-components/dist/esm/theme-provider/types';

export type { ThemeProvider, ThemeProviderTheme };
export { Theme, ThemeProviderDerivedTheme };

/**
 * Directive for Angular integration for the theme provider
 */
@Directive({
    selector: 'nimble-theme-provider'
})
export class NimbleThemeProviderDirective {
    public get theme(): ThemeProviderThemeProperty {
        return this.elementRef.nativeElement.theme;
    }

    @Input() public set theme(value: ThemeProviderThemeProperty | ThemeProviderThemeAttribute) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'theme', value);
    }

    public constructor(private readonly renderer: Renderer2, private readonly elementRef: ElementRef<ThemeProvider>) {}
}
