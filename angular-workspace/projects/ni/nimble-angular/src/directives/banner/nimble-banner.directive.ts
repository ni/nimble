import { Directive, ElementRef, EventEmitter, HostListener, Input, Output, Renderer2 } from '@angular/core';
import type { Banner } from '@ni/nimble-components/dist/esm/banner';
import { BannerSeverity, BannerToggleEventDetail } from '@ni/nimble-components/dist/esm/banner/types';
import { BooleanValueOrAttribute, toBooleanProperty } from '../utilities/template-value-helpers';

export type { Banner };
export { BannerSeverity };
export type { BannerToggleEventDetail };

/**
 * Directive to provide Angular integration for the banner.
 */
@Directive({
    selector: 'nimble-banner'
})
export class NimbleBannerDirective {
    public get open(): boolean {
        return this.elementRef.nativeElement.open;
    }

    @Input() public set open(value: BooleanValueOrAttribute) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'open', toBooleanProperty(value));
    }

    @Output() public openChange = new EventEmitter<boolean>();

    public get severity(): BannerSeverity {
        return this.elementRef.nativeElement.severity;
    }

    @Input() public set severity(value: BannerSeverity) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'severity', value);
    }

    public get titleHidden(): boolean {
        return this.elementRef.nativeElement.titleHidden;
    }

    // Renaming because property should have camel casing, but attribute should not
    // eslint-disable-next-line @angular-eslint/no-input-rename
    @Input('title-hidden') public set titleHidden(value: BooleanValueOrAttribute) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'titleHidden', toBooleanProperty(value));
    }

    public get preventDismiss(): boolean {
        return this.elementRef.nativeElement.preventDismiss;
    }

    // Renaming because property should have camel casing, but attribute should not
    // eslint-disable-next-line @angular-eslint/no-input-rename
    @Input('prevent-dismiss') public set preventDismiss(value: BooleanValueOrAttribute) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'preventDismiss', toBooleanProperty(value));
    }

    public get dismissButtonLabel(): string | undefined {
        return this.elementRef.nativeElement.dismissButtonLabel;
    }

    // Renaming because property should have camel casing, but attribute should not
    // eslint-disable-next-line @angular-eslint/no-input-rename
    @Input('dismiss-button-label') public set dismissButtonLabel(value: string | undefined) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'dismissButtonLabel', value);
    }

    public constructor(private readonly renderer: Renderer2, private readonly elementRef: ElementRef<Banner>) {}

    @HostListener('toggle', ['$event'])
    public onToggle($event: Event): void {
        if ($event.target === this.elementRef.nativeElement) {
            this.openChange.emit(this.open);
        }
    }
}
