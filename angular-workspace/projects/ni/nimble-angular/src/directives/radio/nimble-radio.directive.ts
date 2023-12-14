import { Directive, ElementRef, Input, Renderer2 } from '@angular/core';
import { type Radio, radioTag } from '@ni/nimble-components/dist/esm/radio';
import { BooleanValueOrAttribute, toBooleanProperty } from '@ni/nimble-angular/internal-utilities';

export type { Radio };
export { radioTag };

/**
 * Directive to provide Angular integration for the radio button.
 */
@Directive({
    selector: 'nimble-radio'
})
export class NimbleRadioDirective {
    public get disabled(): boolean {
        return this.elementRef.nativeElement.disabled;
    }

    @Input() public set disabled(value: BooleanValueOrAttribute) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'disabled', toBooleanProperty(value));
    }

    public constructor(private readonly renderer: Renderer2, private readonly elementRef: ElementRef<Radio>) {}
}
