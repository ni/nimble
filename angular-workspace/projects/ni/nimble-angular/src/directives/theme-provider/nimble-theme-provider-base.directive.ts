// AUTO-GENERATED FILE - DO NOT EDIT DIRECTLY
// See generation source in nimble-components/build/generate-labels

import { Directive, ElementRef, Input, Renderer2 } from '@angular/core';
import type { ThemeProvider } from '@ni/nimble-components/dist/esm/theme-provider';

/**
 * Base directive for NimbleThemeProvider which has properties for all of the labels/strings Nimble uses that can be localized
 */
@Directive()
export abstract class NimbleThemeProviderBaseDirective {
    public constructor(protected readonly renderer: Renderer2, protected readonly elementRef: ElementRef<ThemeProvider>) {}

    public get labelNumberFieldIncrement(): string {
        return this.elementRef.nativeElement.labelNumberFieldIncrement;
    }

    @Input() public set labelNumberFieldIncrement(value: string) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'labelNumberFieldIncrement', value);
    }

    public get labelNumberFieldDecrement(): string {
        return this.elementRef.nativeElement.labelNumberFieldDecrement;
    }

    @Input() public set labelNumberFieldDecrement(value: string) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'labelNumberFieldDecrement', value);
    }
}
