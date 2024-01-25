import { Directive, ElementRef, Input, Renderer2 } from '@angular/core';
import { type Anchor, anchorTag } from '@ni/nimble-components/dist/esm/anchor';
import { AnchorAppearance } from '@ni/nimble-components/dist/esm/anchor/types';
import { BooleanValueOrAttribute, toBooleanProperty } from '@ni/nimble-angular/internal-utilities';
import { NimbleAnchorBaseDirective } from '../anchor-base/nimble-anchor-base.directive';

export type { Anchor };
export { anchorTag };
export { AnchorAppearance };

/**
 * Directive to provide Angular integration for the anchor.
 */
@Directive({
    selector: 'nimble-anchor'
})
export class NimbleAnchorDirective extends NimbleAnchorBaseDirective<Anchor> {
    public get appearance(): AnchorAppearance {
        return this.elementRef.nativeElement.appearance;
    }

    @Input() public set appearance(value: AnchorAppearance) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'appearance', value);
    }

    public get underlineHidden(): boolean {
        return this.elementRef.nativeElement.underlineHidden;
    }

    @Input('underline-hidden') public set underlineHidden(value: BooleanValueOrAttribute) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'underlineHidden', toBooleanProperty(value));
    }

    public get contentEditable(): string {
        return this.elementRef.nativeElement.contentEditable;
    }

    @Input('contenteditable') public set contentEditable(value: string) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'contentEditable', value);
    }

    public constructor(renderer: Renderer2, elementRef: ElementRef<Anchor>) {
        super(renderer, elementRef);
    }
}
