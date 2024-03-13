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

    public get errorIcon(): string | undefined {
        return this.elementRef.nativeElement.errorIcon;
    }

    @Input('error-icon') public set errorIcon(value: string | undefined) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'errorIcon', value);
    }

    public get warningIcon(): string | undefined {
        return this.elementRef.nativeElement.warningIcon;
    }

    @Input('warning-icon') public set warningIcon(value: string | undefined) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'warningIcon', value);
    }

    public get informationIcon(): string | undefined {
        return this.elementRef.nativeElement.informationIcon;
    }

    @Input('information-icon') public set informationIcon(value: string | undefined) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'informationIcon', value);
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
}