import { Directive, ElementRef, Input, Renderer2 } from '@angular/core';
import type { InternationalizationCore } from '@ni/nimble-components/dist/esm/i18n/core';

export type { InternationalizationCore };

/**
 * Directive for nimble-i18n-core to allow setting the label properties with customized strings
 */
@Directive({
    selector: 'nimble-i18n-core'
})
export class NimbleInternationalizationCoreDirective {
    public constructor(protected readonly renderer: Renderer2, protected readonly elementRef: ElementRef<InternationalizationCore>) {
    }

    public get bannerDismiss(): string {
        return this.elementRef.nativeElement.bannerDismiss;
    }

    @Input() public set bannerDismiss(value: string) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'bannerDismiss', value);
    }

    public get numberFieldIncrement(): string {
        return this.elementRef.nativeElement.numberFieldIncrement;
    }

    @Input() public set numberFieldIncrement(value: string) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'numberFieldIncrement', value);
    }

    public get numberFieldDecrement(): string {
        return this.elementRef.nativeElement.numberFieldDecrement;
    }

    @Input() public set numberFieldDecrement(value: string) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'numberFieldDecrement', value);
    }
}