import { Directive, ElementRef, Input, Renderer2 } from '@angular/core';
import { type ThemeProvider, themeProviderTag } from '@ni/nimble-components/dist/esm/theme-provider';
import { Theme } from '@ni/nimble-components/dist/esm/theme-provider/types';
import type { ValidityObject } from '@ni/nimble-components/dist/esm/utilities/models/validator';

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
    public get theme(): Theme | null | undefined {
        return this.elementRef.nativeElement.theme;
    }

    @Input() public set theme(value: Theme | null | undefined) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'theme', value);
    }

    public get lang(): string {
        return this.elementRef.nativeElement.lang;
    }

    @Input() public set lang(value: string) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'lang', value);
    }

    public get validity(): ValidityObject {
        return this.elementRef.nativeElement.validity;
    }

    public constructor(private readonly renderer: Renderer2, private readonly elementRef: ElementRef<ThemeProvider>) {}

    public checkValidity(): boolean {
        return this.elementRef.nativeElement.checkValidity();
    }
}
