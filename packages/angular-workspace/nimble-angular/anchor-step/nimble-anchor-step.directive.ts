import { Directive, ElementRef, Input, Renderer2 } from '@angular/core';
import { type AnchorStep, anchorStepTag } from '@ni/nimble-components/dist/esm/anchor-step';
import type { AnchorStepSeverity } from '@ni/nimble-components/dist/esm/anchor-step/types';
import { type BooleanValueOrAttribute, toBooleanProperty } from '@ni/nimble-angular/internal-utilities';
import { NimbleAnchorBaseDirective } from '../src/directives/anchor-base/nimble-anchor-base.directive';

export type { AnchorStep };
export { anchorStepTag };
export { AnchorStepSeverity };

/**
 * Directive to provide Angular integration for the anchor step element.
 */
@Directive({
    selector: 'nimble-anchor-step',
    standalone: false
})
export class NimbleAnchorStepDirective extends NimbleAnchorBaseDirective<AnchorStep> {
    public get severity(): AnchorStepSeverity {
        return this.elementRef.nativeElement.severity;
    }

    @Input() public set severity(value: AnchorStepSeverity) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'severity', value);
    }

    public get disabled(): boolean {
        return this.elementRef.nativeElement.disabled;
    }

    @Input() public set disabled(value: BooleanValueOrAttribute) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'disabled', toBooleanProperty(value));
    }

    public get readOnly(): boolean {
        return this.elementRef.nativeElement.readOnly;
    }

    @Input() public set readOnly(value: BooleanValueOrAttribute) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'readOnly', toBooleanProperty(value));
    }

    public get selected(): boolean {
        return this.elementRef.nativeElement.selected;
    }

    @Input() public set selected(value: BooleanValueOrAttribute) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'selected', toBooleanProperty(value));
    }

    public constructor(renderer: Renderer2, elementRef: ElementRef<AnchorStep>) {
        super(renderer, elementRef);
    }
}
