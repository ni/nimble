import { Directive, ElementRef, Input, Renderer2 } from '@angular/core';
import type { AnchorTab } from '@ni/nimble-components/dist/esm/anchor-tab';
import { NimbleAnchorBaseDirective } from '../anchor-base/nimble-anchor-base.directive';
import { BooleanValueOrAttribute, toBooleanProperty } from '@ni/nimble-angular/internal-utilities';

export type { AnchorTab };

/**
 * Directive to provide Angular integration for the anchor tab.
 */
@Directive({
    selector: 'nimble-anchor-tab'
})
export class NimbleAnchorTabDirective extends NimbleAnchorBaseDirective<AnchorTab> {
    public get disabled(): boolean {
        return this.elementRef.nativeElement.disabled;
    }

    @Input() public set disabled(value: BooleanValueOrAttribute) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'disabled', toBooleanProperty(value));
    }

    public constructor(renderer: Renderer2, elementRef: ElementRef<AnchorTab>) {
        super(renderer, elementRef);
    }
}
