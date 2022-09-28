import { Directive, ElementRef, Input, Renderer2 } from '@angular/core';
import { Orientation } from '@ni/nimble-components/dist/esm/radio-group';
import type { RadioGroup } from '@ni/nimble-components/dist/esm/radio-group';
import { BooleanValueOrAttribute, toBooleanProperty } from '../utilities/template-value-helpers';

export { Orientation };
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

    public get name(): string {
        return this.elementRef.nativeElement.name;
    }

    @Input() public set name(value: string) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'name', value);
    }

    public get orientation(): Orientation {
        return this.elementRef.nativeElement.orientation;
    }

    @Input() public set orientation(value: Orientation) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'orientation', value);
    }

    public constructor(private readonly renderer: Renderer2, private readonly elementRef: ElementRef<RadioGroup>) {}
}
