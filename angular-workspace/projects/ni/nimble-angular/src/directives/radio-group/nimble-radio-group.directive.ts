import { Directive, ElementRef, Input, Renderer2 } from '@angular/core';
import type { RadioGroup } from '@ni/nimble-components/dist/esm/radio-group';
import { BooleanValueOrAttribute, toBooleanProperty } from '../utilities/template-value-helpers';

export type { RadioGroup };

/**
 * Directive to provide Angular integration for the radio group.
 */
@Directive({
    selector: 'nimble-radio-group'
})
export class NimbleRadioGroupDirective {
    public get disabled(): boolean {
        return this.elementRef.nativeElement.disabled;
    }

    @Input() public set disabled(value: BooleanValueOrAttribute) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'disabled', toBooleanProperty(value));
    }

    public constructor(private readonly renderer: Renderer2, private readonly elementRef: ElementRef<RadioGroup>) {}
}
