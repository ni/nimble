import { Directive, ElementRef, Input, Renderer2 } from '@angular/core';
import type { AnchorMenuItem } from '@ni/nimble-components/dist/esm/anchor-menu-item';
import { BooleanValueOrAttribute, toBooleanProperty } from '@ni/nimble-angular/internal-utilities';
import { NimbleAnchorBaseDirective } from '../anchor-base/nimble-anchor-base.directive';

export type { AnchorMenuItem };

/**
 * Directive to provide Angular integration for the anchor menu item.
 */
@Directive({
    selector: 'nimble-anchor-menu-item'
})
export class NimbleAnchorMenuItemDirective extends NimbleAnchorBaseDirective<AnchorMenuItem> {
    public get disabled(): boolean {
        return this.elementRef.nativeElement.disabled;
    }

    @Input() public set disabled(value: BooleanValueOrAttribute) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'disabled', toBooleanProperty(value));
    }

    public constructor(renderer: Renderer2, elementRef: ElementRef<AnchorMenuItem>) {
        super(renderer, elementRef);
    }
}
