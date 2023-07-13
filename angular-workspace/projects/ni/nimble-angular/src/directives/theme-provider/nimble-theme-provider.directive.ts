import { Directive, ElementRef, Input, Renderer2 } from '@angular/core';
import { type ThemeProvider, themeProviderTag } from '@ni/nimble-components/dist/esm/theme-provider';
import { Theme } from '@ni/nimble-components/dist/esm/theme-provider/types';

export type { ThemeProvider };
export { themeProviderTag };
export { Theme };

/**
 * Directive for Angular integration for the theme provider
 */
@Directive({
    selector: 'nimble-theme-provider'
})
export class NimbleThemeProviderDirective {
    public get theme(): Theme {
        return this.elementRef.nativeElement.theme;
    }

    @Input() public set theme(value: Theme) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'theme', value);
    }

    public constructor(private readonly renderer: Renderer2, private readonly elementRef: ElementRef<ThemeProvider>) {}
}
