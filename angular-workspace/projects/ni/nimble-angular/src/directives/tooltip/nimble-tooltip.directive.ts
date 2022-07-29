import { Directive, ElementRef, Input, Renderer2 } from '@angular/core';
import type { Tooltip } from '@ni/nimble-components/dist/esm/tooltip';
import { TooltipStatus } from '@ni/nimble-components/dist/esm/tooltip/types';

export type { Tooltip };
export { TooltipStatus };

/**
 * Directive to provide Angular integration for the tooltip.
 */
@Directive({
    selector: 'nimble-tooltip'
})
export class NimbleTooltipDirective {
    public get anchor(): string {
        return this.elementRef.nativeElement.anchor;
    }

    @Input() public set anchor(value: string) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'anchor', value);
    }

    public constructor(private readonly renderer: Renderer2, private readonly elementRef: ElementRef<Tooltip>) {}
}