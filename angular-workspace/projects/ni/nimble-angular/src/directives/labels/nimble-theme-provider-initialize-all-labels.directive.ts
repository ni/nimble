// AUTO-GENERATED FILE - DO NOT EDIT DIRECTLY
// See generation source in nimble-components/build/generate-labels

import '@angular/localize/init';
import { Directive, ElementRef, Renderer2 } from '@angular/core';
import type { ThemeProvider } from '@ni/nimble-components/dist/esm/theme-provider';
import { NimbleLabels } from './nimble-labels';

/**
 * Directive for Nimble theme provider which will initialize all Nimble labels on this theme provider to the
 * localizable values defined in NimbleLabels
 */
@Directive({
    selector: 'nimble-theme-provider[initializeAllLabels]'
})
export class NimbleThemeProviderInitializeAllLabelsDirective {
    public constructor(private readonly renderer: Renderer2, private readonly elementRef: ElementRef<ThemeProvider>) {
        this.elementRef.nativeElement.labelNumberFieldIncrement = NimbleLabels.labelNumberFieldIncrement;
        this.elementRef.nativeElement.labelNumberFieldDecrement = NimbleLabels.labelNumberFieldDecrement;
    }
}