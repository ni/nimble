import { Directive, ElementRef, Input, Renderer2 } from '@angular/core';
import type { Tooltip } from '@ni/nimble-components/dist/esm/tooltip';
import type { TooltipStatus } from '@ni/nimble-components/dist/esm/tooltip/types';
import { BooleanValueOrAttribute, toBooleanProperty } from '../utilities/template-value-helpers';

export type { Tooltip, TooltipStatus };

/**
 * Directive to provide Angular integration for the tooltip.
 */
@Directive({
    selector: 'nimble-tooltip'
})
export class NimbleTooltipDirective {
    public get visible(): boolean {
        return this.elementRef.nativeElement.visible;
    }

    @Input() public set visible(value: BooleanValueOrAttribute) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'visible', toBooleanProperty(value));
    }

    public get anchor(): string {
        return this.elementRef.nativeElement.anchor;
    }

    @Input() public set anchor(value: string) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'anchor', value);
    }

    public constructor(private readonly renderer: Renderer2, private readonly elementRef: ElementRef<Tooltip>) {}
}