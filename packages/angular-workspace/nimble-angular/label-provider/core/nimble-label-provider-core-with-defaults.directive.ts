import { Directive, ElementRef, Renderer2 } from '@angular/core';
import type { LabelProviderCore } from '@ni/nimble-components/dist/esm/label-provider/core';

import '@angular/localize/init';

/**
 * Directive for nimble-label-provider-core which will initialize all of the labels with $localize-tagged strings, for apps
 * using @angular/localize.
 */
@Directive({
    selector: 'nimble-label-provider-core[withDefaults]'
})
export class NimbleLabelProviderCoreWithDefaultsDirective {
    public constructor(protected readonly renderer: Renderer2, protected readonly elementRef: ElementRef<LabelProviderCore>) {
        this.elementRef.nativeElement.popupDismiss = $localize`:Nimble popup - dismiss|:Close`;
        this.elementRef.nativeElement.numericDecrement = $localize`:Nimble numeric - decrement|:Decrement`;
        this.elementRef.nativeElement.numericIncrement = $localize`:Nimble numeric - increment|:Increment`;
        this.elementRef.nativeElement.popupIconError = $localize`:Nimble popup icon - error|:Error`;
        this.elementRef.nativeElement.popupIconWarning = $localize`:Nimble popup icon - warning|:Warning`;
        this.elementRef.nativeElement.popupIconInformation = $localize`:Nimble popup icon - information|:Information`;
        this.elementRef.nativeElement.filterSearch = $localize`:Nimble select - search items|:Search`;
        this.elementRef.nativeElement.filterNoResults = $localize`:Nimble select - no items|:No items found`;
        this.elementRef.nativeElement.loading = $localize`:Nimble loading - loading|:Loading…`;
        this.elementRef.nativeElement.scrollBackward = $localize`:Nimble scroll backward|:Scroll backward`;
        this.elementRef.nativeElement.scrollForward = $localize`:Nimble scroll forward|:Scroll forward`;
    }
}