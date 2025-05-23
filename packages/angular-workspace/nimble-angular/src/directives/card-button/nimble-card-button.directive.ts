import { Directive, ElementRef, Input, Renderer2 } from '@angular/core';
import { type CardButton, cardButtonTag } from '@ni/nimble-components/dist/esm/card-button';
import { type BooleanValueOrAttribute, toBooleanProperty } from '@ni/nimble-angular/internal-utilities';

export type { CardButton };
export { cardButtonTag };

/**
 * Directive to provide Angular integration for the card button.
 */
@Directive({
    selector: 'nimble-card-button'
})
export class NimbleCardButtonDirective {
    public get disabled(): boolean {
        return this.elementRef.nativeElement.disabled;
    }

    @Input() public set disabled(value: BooleanValueOrAttribute) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'disabled', toBooleanProperty(value));
    }

    public get selected(): boolean {
        return this.elementRef.nativeElement.selected;
    }

    @Input() public set selected(value: BooleanValueOrAttribute) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'selected', toBooleanProperty(value));
    }

    public constructor(private readonly renderer: Renderer2, private readonly elementRef: ElementRef<CardButton>) {}
}
