import { Directive, ElementRef, Input, Renderer2 } from '@angular/core';
import { type AnchorButton, anchorButtonTag } from '@ni/nimble-components/dist/esm/anchor-button';
import type { ButtonAppearance, ButtonAppearanceVariant } from '@ni/nimble-components/dist/esm/anchor-button/types';
import { BooleanValueOrAttribute, toBooleanProperty } from '@ni/nimble-angular/internal-utilities';
import { NimbleAnchorBaseDirective } from '../anchor-base/nimble-anchor-base.directive';

export type { AnchorButton };
export { anchorButtonTag };

/**
 * Directive to provide Angular integration for the anchor button.
 */
@Directive({
    selector: 'nimble-anchor-button'
})
export class NimbleAnchorButtonDirective extends NimbleAnchorBaseDirective<AnchorButton> {
    public get appearance(): ButtonAppearance {
        return this.elementRef.nativeElement.appearance;
    }

    @Input() public set appearance(value: ButtonAppearance) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'appearance', value);
    }

    public get appearanceVariant(): ButtonAppearanceVariant {
        return this.elementRef.nativeElement.appearanceVariant;
    }

    @Input('appearance-variant') public set appearanceVariant(value: ButtonAppearanceVariant) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'appearanceVariant', value);
    }

    public get contentHidden(): boolean {
        return this.elementRef.nativeElement.contentHidden;
    }

    @Input('content-hidden') public set contentHidden(value: BooleanValueOrAttribute) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'contentHidden', toBooleanProperty(value));
    }

    public get disabled(): boolean {
        return this.elementRef.nativeElement.disabled;
    }

    @Input() public set disabled(value: BooleanValueOrAttribute) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'disabled', toBooleanProperty(value));
    }

    public constructor(renderer: Renderer2, elementRef: ElementRef<AnchorButton>) {
        super(renderer, elementRef);
    }
}
