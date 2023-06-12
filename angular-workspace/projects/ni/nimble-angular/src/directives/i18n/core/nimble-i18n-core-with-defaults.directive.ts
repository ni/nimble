import { Directive, ElementRef, Renderer2 } from '@angular/core';
import type { InternationalizationCore } from '@ni/nimble-components/dist/esm/i18n/core';

import '@angular/localize/init';

/**
 * Directive for nimble-i18n-core which will initialize all of the label properties on this i18n provider.
 * The property values use $localize to request localization.
 */
@Directive({
    selector: 'nimble-i18n-core[withDefaults]'
})
export class NimbleInternationalizationCoreWithDefaultsDirective {
    public constructor(protected readonly renderer: Renderer2, protected readonly elementRef: ElementRef<InternationalizationCore>) {
        this.elementRef.nativeElement.bannerDismiss = $localize`:Nimble banner dismiss button:Close`;
        this.elementRef.nativeElement.numberFieldDecrement = $localize`:Nimble number field decrement button:Decrement`;
        this.elementRef.nativeElement.numberFieldIncrement = $localize`:Nimble number field increment button:Increment`;
    }
}