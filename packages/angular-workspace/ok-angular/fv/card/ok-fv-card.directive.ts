import { Directive, ElementRef, Input, Renderer2 } from '@angular/core';
import type { FvCard } from '@ni/ok-components/dist/esm/fv/card';
import { fvCardTag } from '@ni/ok-components/dist/esm/fv/card';
import { FvCardAppearance, FvCardInteractionMode } from '@ni/ok-components/dist/esm/fv/card/types';
import { type BooleanValueOrAttribute, toBooleanProperty } from '@ni/nimble-angular/internal-utilities';

export type { FvCard };
export { fvCardTag };
export { FvCardAppearance, FvCardInteractionMode };

/**
 * Directive to provide Angular integration for the card.
 */
@Directive({
    selector: 'ok-fv-card',
    standalone: false
})
export class OkFvCardDirective {
    public get title(): string {
        return this.elementRef.nativeElement.title;
    }

    @Input('card-title')
    public set title(value: string) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'title', value);
    }

    public get subtitle(): string {
        return this.elementRef.nativeElement.subtitle;
    }

    @Input()
    public set subtitle(value: string) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'subtitle', value);
    }

    public get description(): string {
        return this.elementRef.nativeElement.description;
    }

    @Input()
    public set description(value: string) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'description', value);
    }

    public get appearance(): FvCardAppearance {
        return this.elementRef.nativeElement.appearance;
    }

    @Input()
    public set appearance(value: FvCardAppearance) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'appearance', value);
    }

    public get interactionMode(): FvCardInteractionMode {
        return this.elementRef.nativeElement.interactionMode;
    }

    @Input('interaction-mode')
    public set interactionMode(value: FvCardInteractionMode) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'interactionMode', value);
    }

    public get disabled(): boolean {
        return this.elementRef.nativeElement.disabled;
    }

    @Input()
    public set disabled(value: BooleanValueOrAttribute) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'disabled', toBooleanProperty(value));
    }

    public get initials(): string {
        return this.elementRef.nativeElement.initials;
    }

    @Input()
    public set initials(value: string) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'initials', value);
    }

    public constructor(
        private readonly elementRef: ElementRef<FvCard>,
        private readonly renderer: Renderer2
    ) {}
}
