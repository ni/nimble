import { Directive, ElementRef, Input, Renderer2 } from '@angular/core';
import type { Tooltip } from '@ni/nimble-components/dist/esm/tooltip';
import { TooltipSeverity } from '@ni/nimble-components/dist/esm/tooltip/types';
import { BooleanValueOrAttribute, NumberValueOrAttribute, toBooleanProperty, toNumberProperty } from '../utilities/template-value-helpers';

export type { Tooltip };
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

    // iconVisible property intentionally maps to the icon-visible attribute
    // eslint-disable-next-line @angular-eslint/no-input-rename
    @Input('icon-visible') public set iconVisible(value: BooleanValueOrAttribute) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'iconVisible', toBooleanProperty(value));
    }

    public constructor(private readonly renderer: Renderer2, private readonly elementRef: ElementRef<Tooltip>) {}
}