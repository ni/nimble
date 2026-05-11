import { Directive, ElementRef, Input, Renderer2 } from '@angular/core';
import type { FvSplitButtonAnchor } from '@ni/ok-components/dist/esm/fv/split-button-anchor';
import { fvSplitButtonAnchorTag } from '@ni/ok-components/dist/esm/fv/split-button-anchor';
import { FvSplitButtonAnchorAppearance, FvSplitButtonAnchorAppearanceVariant } from '@ni/ok-components/dist/esm/fv/split-button-anchor/types';
import { type BooleanValueOrAttribute, toBooleanProperty } from '@ni/nimble-angular/internal-utilities';

export type { FvSplitButtonAnchor };
export { fvSplitButtonAnchorTag };
export { FvSplitButtonAnchorAppearance, FvSplitButtonAnchorAppearanceVariant };

/**
 * Directive to provide Angular integration for the split button anchor.
 */
@Directive({
    selector: 'ok-fv-split-button-anchor',
    standalone: false
})
export class OkFvSplitButtonAnchorDirective {
    public get label(): string {
        return this.elementRef.nativeElement.label;
    }

    @Input()
    public set label(value: string) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'label', value);
    }

    public get href(): string {
        return this.elementRef.nativeElement.href;
    }

    @Input()
    public set href(value: string) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'href', value);
    }

    public get target(): string {
        return this.elementRef.nativeElement.target;
    }

    @Input()
    public set target(value: string) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'target', value);
    }

    public get rel(): string {
        return this.elementRef.nativeElement.rel;
    }

    @Input()
    public set rel(value: string) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'rel', value);
    }

    public get download(): string {
        return this.elementRef.nativeElement.download;
    }

    @Input()
    public set download(value: string) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'download', value);
    }

    public get disabled(): boolean {
        return this.elementRef.nativeElement.disabled;
    }

    @Input()
    public set disabled(value: BooleanValueOrAttribute) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'disabled', toBooleanProperty(value));
    }

    public get open(): boolean {
        return this.elementRef.nativeElement.open;
    }

    @Input()
    public set open(value: BooleanValueOrAttribute) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'open', toBooleanProperty(value));
    }

    public get appearance(): FvSplitButtonAnchorAppearance {
        return this.elementRef.nativeElement.appearance;
    }

    @Input()
    public set appearance(value: FvSplitButtonAnchorAppearance) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'appearance', value);
    }

    public get appearanceVariant(): FvSplitButtonAnchorAppearanceVariant {
        return this.elementRef.nativeElement.appearanceVariant;
    }

    @Input()
    public set appearanceVariant(value: FvSplitButtonAnchorAppearanceVariant) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'appearanceVariant', value);
    }

    public constructor(
        private readonly elementRef: ElementRef<FvSplitButtonAnchor>,
        private readonly renderer: Renderer2
    ) {}
}
