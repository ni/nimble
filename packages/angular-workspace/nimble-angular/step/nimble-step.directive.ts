import { Directive, ElementRef, Input, Renderer2 } from '@angular/core';
import { type Step, stepTag } from '@ni/nimble-components/dist/esm/step';
import { StepSeverity } from '@ni/nimble-components/dist/esm/step/types';
import { type BooleanValueOrAttribute, toBooleanProperty } from '@ni/nimble-angular/internal-utilities';

export type { Step };
export { stepTag };
export { StepSeverity };

/**
 * Directive to provide Angular integration for the step element.
 */
@Directive({
    selector: 'nimble-step',
    standalone: false
})
export class NimbleStepDirective {
    public get severity(): StepSeverity {
        return this.elementRef.nativeElement.severity;
    }

    @Input() public set severity(value: StepSeverity) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'severity', value);
    }

    public get severityText(): string | undefined {
        return this.elementRef.nativeElement.severityText;
    }

    @Input('severity-text') public set severityText(value: string | undefined) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'severityText', value);
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

    public constructor(private readonly renderer: Renderer2, private readonly elementRef: ElementRef<Step>) {}
}
