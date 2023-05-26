import { Directive, ElementRef, Input, Renderer2 } from '@angular/core';
import type { ThemeProvider } from '@ni/nimble-components/dist/esm/theme-provider';
import { Theme } from '@ni/nimble-components/dist/esm/theme-provider/types';
import { NimbleThemeProviderBaseDirective } from './nimble-theme-provider-base.directive';

export type { ThemeProvider };
export { Theme };

/**
 * Directive for Angular integration for the theme provider
 */
@Directive({
    selector: 'nimble-theme-provider'
})
export class NimbleThemeProviderDirective extends NimbleThemeProviderBaseDirective {
    public get theme(): Theme {
        return this.elementRef.nativeElement.theme;
    }

    @Input() public set theme(value: Theme) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'theme', value);
    }

    public constructor(renderer: Renderer2, elementRef: ElementRef<ThemeProvider>) {
        super(renderer, elementRef);
    }
}
