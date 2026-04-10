import { Directive, ElementRef, Input, Renderer2 } from '@angular/core';
import { type Stepper, stepperTag } from '@ni/nimble-components/dist/esm/stepper';
import type { StepperOrientation } from '@ni/nimble-components/dist/esm/stepper/types';

export type { Stepper };
export { stepperTag };
export { StepperOrientation };

/**
 * Directive to provide Angular integration for the stepper element.
 */
@Directive({
    selector: 'nimble-stepper',
    standalone: false
})
export class NimbleStepperDirective {
    public get orientation(): StepperOrientation {
        return this.elementRef.nativeElement.orientation;
    }

    @Input() public set orientation(value: StepperOrientation) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'orientation', value);
    }

    public constructor(private readonly renderer: Renderer2, private readonly elementRef: ElementRef<Stepper>) {}
}
