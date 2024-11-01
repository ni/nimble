import { Directive, ElementRef, Input, Renderer2 } from '@angular/core';
import type { LabelProviderCore } from '@ni/nimble-components/dist/esm/label-provider/core';

export type { LabelProviderCore };

/**
 * Directive to provide Angular integration for the core label provider.
 * To use the Nimble-provided strings declared via $localize, instead use NimbleLabelProviderTableWithDefaultsDirective.
 */
@Directive({
    selector: 'nimble-label-provider-core'
})
export class NimbleLabelProviderCoreDirective {
    public constructor(protected readonly renderer: Renderer2, protected readonly elementRef: ElementRef<LabelProviderCore>) {
    }

    public get popupDismiss(): string | undefined {
        return this.elementRef.nativeElement.popupDismiss;
    }

    @Input('popup-dismiss') public set popupDismiss(value: string | undefined) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'popupDismiss', value);
    }

    public get numericDecrement(): string | undefined {
        return this.elementRef.nativeElement.numericDecrement;
    }

    @Input('numeric-decrement') public set numericDecrement(value: string | undefined) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'numericDecrement', value);
    }

    public get numericIncrement(): string | undefined {
        return this.elementRef.nativeElement.numericIncrement;
    }

    @Input('numeric-increment') public set numericIncrement(value: string | undefined) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'numericIncrement', value);
    }

    public get popupIconError(): string | undefined {
        return this.elementRef.nativeElement.popupIconError;
    }

    @Input('popup-icon-error') public set popupIconError(value: string | undefined) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'popupIconError', value);
    }

    public get popupIconWarning(): string | undefined {
        return this.elementRef.nativeElement.popupIconWarning;
    }

    @Input('popup-icon-warning') public set popupIconWarning(value: string | undefined) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'popupIconWarning', value);
    }

    public get popupIconInformation(): string | undefined {
        return this.elementRef.nativeElement.popupIconInformation;
    }

    @Input('popup-icon-information') public set popupIconInformation(value: string | undefined) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'popupIconInformation', value);
    }

    public get filterSearch(): string | undefined {
        return this.elementRef.nativeElement.filterSearch;
    }

    @Input('filter-search') public set filterSearch(value: string | undefined) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'filterSearch', value);
    }

    public get filterNoResults(): string | undefined {
        return this.elementRef.nativeElement.filterNoResults;
    }

    @Input('filter-no-results') public set filterNoResults(value: string | undefined) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'filterNoResults', value);
    }

    public get loading(): string | undefined {
        return this.elementRef.nativeElement.loading;
    }

    @Input('loading') public set loading(value: string | undefined) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'loading', value);
    }

    public get scrollBackward(): string | undefined {
        return this.elementRef.nativeElement.scrollBackward;
    }

    @Input('scrollBackward') public set scrollBackward(value: string | undefined) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'scrollBackward', value);
    }

    public get scrollForward(): string | undefined {
        return this.elementRef.nativeElement.scrollForward;
    }

    @Input('scrollForward') public set scrollForward(value: string | undefined) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'scrollForward', value);
    }
}