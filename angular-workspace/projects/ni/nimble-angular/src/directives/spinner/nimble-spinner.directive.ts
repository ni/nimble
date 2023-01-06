import { Directive, ElementRef, Input, Renderer2 } from '@angular/core';
import type { Spinner } from '@ni/nimble-components/dist/esm/spinner';
import { SpinnerSize } from '@ni/nimble-components/dist/esm/spinner/types';

export type { Spinner };
export { SpinnerSize };

/**
 * Directive to provide Angular integration for the spinner.
 */
@Directive({
    selector: 'nimble-spinner'
})
export class NimbleSpinnerDirective {
    public get size(): SpinnerSize {
        return this.elementRef.nativeElement.size;
    }

    @Input() public set size(value: SpinnerSize) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'size', value);
    }

    public constructor(private readonly renderer: Renderer2, private readonly elementRef: ElementRef<Spinner>) {}
}
