import { Directive, ElementRef, Input, Renderer2 } from '@angular/core';
import { type Tooltip, tooltipTag } from '@ni/nimble-components/dist/esm/tooltip';
import { TooltipSeverity } from '@ni/nimble-components/dist/esm/tooltip/types';
import { type BooleanValueOrAttribute, type NumberValueOrAttribute, toBooleanProperty, toNumberProperty } from '@ni/nimble-angular/internal-utilities';

export type { Tooltip };
export { tooltipTag };
export { TooltipSeverity };

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

    public get delay(): number {
        return this.elementRef.nativeElement.delay;
    }

    @Input() public set delay(value: NumberValueOrAttribute) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'delay', toNumberProperty(value));
    }

    public get severity(): TooltipSeverity {
        return this.elementRef.nativeElement.severity;
    }

    @Input() public set severity(value: TooltipSeverity) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'severity', value);
    }

    public get iconVisible(): boolean {
        return this.elementRef.nativeElement.iconVisible;
    }

    @Input('icon-visible') public set iconVisible(value: BooleanValueOrAttribute) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'iconVisible', toBooleanProperty(value));
    }

    public constructor(private readonly renderer: Renderer2, private readonly elementRef: ElementRef<Tooltip>) {}
}