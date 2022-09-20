import { Directive, ElementRef, Input, Renderer2 } from '@angular/core';
import { Orientation, RadioGroup } from '@ni/nimble-components/dist/esm/radio-group';
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
    private _nextOpenId = 0;

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

    public get value(): string {
        return this.elementRef.nativeElement.value;
    }

    @Input() public set value(value: string) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'value', value);
    }

    public constructor(private readonly renderer: Renderer2, private readonly elementRef: ElementRef<RadioGroup>) {}

    /** @internal */
    public allocateId(): string {
        const id = this._nextOpenId.toString();
        this._nextOpenId += 1;
        return id;
    }
}
