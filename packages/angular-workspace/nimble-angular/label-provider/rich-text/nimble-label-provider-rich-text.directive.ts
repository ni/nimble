import { Directive, ElementRef, Input, Renderer2 } from '@angular/core';
import type { LabelProviderRichText } from '@ni/nimble-components/dist/esm/label-provider/rich-text';

export type { LabelProviderRichText };

/**
 * Directive to provide Angular integration for the nimble-rich-text label provider.
 * To use the Nimble-provided strings declared via $localize, instead use NimbleLabelProviderRichTextWithDefaultsDirective.
 */
@Directive({
    selector: 'nimble-label-provider-rich-text'
})
export class NimbleLabelProviderRichTextDirective {
    public constructor(protected readonly renderer: Renderer2, protected readonly elementRef: ElementRef<LabelProviderRichText>) {
    }

    public get toggleBold(): string | undefined {
        return this.elementRef.nativeElement.toggleBold;
    }

    @Input('toggle-bold') public set toggleBold(value: string | undefined) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'toggleBold', value);
    }

    public get toggleItalics(): string | undefined {
        return this.elementRef.nativeElement.toggleItalics;
    }

    @Input('toggle-italics') public set toggleItalics(value: string | undefined) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'toggleItalics', value);
    }

    public get toggleBulletedList(): string | undefined {
        return this.elementRef.nativeElement.toggleBulletedList;
    }

    @Input('toggle-bulleted-list') public set toggleBulletedList(value: string | undefined) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'toggleBulletedList', value);
    }

    public get toggleNumberedList(): string | undefined {
        return this.elementRef.nativeElement.toggleNumberedList;
    }

    @Input('toggle-numbered-list') public set toggleNumberedList(value: string | undefined) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'toggleNumberedList', value);
    }
}