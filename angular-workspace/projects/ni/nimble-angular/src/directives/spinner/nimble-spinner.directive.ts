import { Directive, ElementRef, Input, Renderer2 } from '@angular/core';
import { type Spinner, spinnerTag } from '@ni/nimble-components/dist/esm/spinner';
import type { SpinnerAppearance } from '@ni/nimble-components/dist/esm/spinner/types';

export type { Spinner };
export { spinnerTag };

/**
 * Directive to provide Angular integration for the spinner.
 */
@Directive({
    selector: 'nimble-spinner'
})
export class NimbleSpinnerDirective {
    public get appearance(): SpinnerAppearance {
        return this.elementRef.nativeElement.appearance;
    }

    @Input() public set appearance(value: SpinnerAppearance) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'appearance', value);
    }

    public constructor(private readonly renderer: Renderer2, private readonly elementRef: ElementRef<Spinner>) {}
}
