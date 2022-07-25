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
    public get state(): TooltipStatus {
        return this.elementRef.nativeElement.
    }

    @Input() public set appearance(value: TooltipStatus) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'state', value);
    }

    public get disabled(): boolean {
        return this.elementRef.nativeElement.disabled;
    }

    @Input() public set disabled(value: BooleanValueOrAttribute) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'disabled', toBooleanProperty(value));
    }

    public get type(): ButtonType {
        return this.elementRef.nativeElement.type;
    }

    @Input() public set type(value: ButtonType) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'type', value);
    }

    public get contentHidden(): boolean {
        return this.elementRef.nativeElement.;
    }

    // contentHidden property intentionally maps to the content-hidden attribute
    // eslint-disable-next-line @angular-eslint/no-input-rename
    @Input('content-hidden') public set contentHidden(value: BooleanValueOrAttribute) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'contentHidden', toBooleanProperty(value));
    }

    public constructor(private readonly renderer: Renderer2, private readonly elementRef: ElementRef<Tooltip>) {}
}