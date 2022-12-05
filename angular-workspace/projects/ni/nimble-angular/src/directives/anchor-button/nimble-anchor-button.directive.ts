import { Directive, ElementRef, Input, Renderer2 } from '@angular/core';
import type { AnchorButton } from '@ni/nimble-components/dist/esm/anchor-button';
import type { ButtonAppearance, ButtonAppearanceVariant } from '@ni/nimble-components/dist/esm/anchor-button/types';
import { NimbleLinkBase } from '../patterns/link/nimble-link-base';
import { BooleanValueOrAttribute, toBooleanProperty } from '../utilities/template-value-helpers';

export type { AnchorButton };
export { ButtonAppearanceVariant };

/**
 * Directive to provide Angular integration for the anchor button.
 */
@Directive({
    selector: 'nimble-anchor-button'
})
export class NimbleAnchorButtonDirective extends NimbleLinkBase<AnchorButton> {
    public get appearance(): ButtonAppearance {
        return this.elementRef.nativeElement.appearance;
    }

    @Input() public set appearance(value: ButtonAppearance) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'appearance', value);
    }

    public get appearanceVariant(): ButtonAppearanceVariant {
        return this.elementRef.nativeElement.appearanceVariant;
    }

    // Renaming because property should have camel casing, but attribute should not
    // eslint-disable-next-line @angular-eslint/no-input-rename
    @Input('appearance-variant') public set appearanceVariant(value: ButtonAppearanceVariant) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'appearanceVariant', value);
    }

    public get contentHidden(): boolean {
        return this.elementRef.nativeElement.contentHidden;
    }

    // Renaming because property should have camel casing, but attribute should not
    // eslint-disable-next-line @angular-eslint/no-input-rename
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
