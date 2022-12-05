import { Directive, ElementRef, Input, Renderer2 } from '@angular/core';
import type { Anchor } from '@ni/nimble-components/dist/esm/anchor';
import type { AnchorAppearance } from '@ni/nimble-components/dist/esm/anchor/types';
import { NimbleLinkBase } from '../patterns/link/nimble-link-base';
import { BooleanValueOrAttribute, toBooleanProperty } from '../utilities/template-value-helpers';

export type { Anchor };
export { AnchorAppearance };

/**
 * Directive to provide Angular integration for the anchor.
 */
@Directive({
    selector: 'nimble-anchor'
})
export class NimbleAnchorDirective extends NimbleLinkBase<Anchor> {
    public get appearance(): AnchorAppearance {
        return this.elementRef.nativeElement.appearance;
    }

    @Input() public set appearance(value: AnchorAppearance) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'appearance', value);
    }

    public get underlineVisible(): boolean {
        return this.elementRef.nativeElement.underlineVisible;
    }

    // Renaming because property should have camel casing, but attribute should not
    // eslint-disable-next-line @angular-eslint/no-input-rename
    @Input('underline-visible') public set underlineVisible(value: BooleanValueOrAttribute) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'underlineVisible', toBooleanProperty(value));
    }

    public constructor(renderer: Renderer2, elementRef: ElementRef<Anchor>) {
        super(renderer, elementRef);
    }
}
