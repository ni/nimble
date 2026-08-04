import { Directive, Input } from '@angular/core';
import { type AnchorButton, anchorButtonTag } from '@ni/nimble-components/dist/esm/anchor-button';
import type { ButtonAppearance, ButtonAppearanceVariant } from '@ni/nimble-components/dist/esm/anchor-button/types';
import { type BooleanValueOrAttribute, toBooleanProperty } from '@ni/nimble-angular/internal-utilities';
import { DisableableNimbleAnchorBaseDirective } from '../anchor-base/disableable-nimble-anchor-base.directive';

export type { AnchorButton };
export { anchorButtonTag };

/**
 * Directive to provide Angular integration for the anchor button.
 */
@Directive({
    selector: 'nimble-anchor-button',
    standalone: false
})
export class NimbleAnchorButtonDirective extends DisableableNimbleAnchorBaseDirective<AnchorButton> {
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
}
