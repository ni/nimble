import { Directive, ElementRef, Input, Renderer2 } from '@angular/core';
import { Orientation, radioGroupTag } from '@ni/nimble-components/dist/esm/radio-group';
import type { RadioGroup } from '@ni/nimble-components/dist/esm/radio-group';
import { BooleanValueOrAttribute, toBooleanProperty } from '@ni/nimble-angular/internal-utilities';

export { Orientation };
export type { RadioGroup };
export { radioGroupTag };

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

    public get errorText(): string | undefined {
        return this.elementRef.nativeElement.errorText;
    }

    @Input('error-text') public set errorText(value: string | undefined) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'errorText', value);
    }

    public get errorVisible(): boolean {
        return this.elementRef.nativeElement.errorVisible;
    }

    @Input('error-visible') public set errorVisible(value: BooleanValueOrAttribute) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'errorVisible', toBooleanProperty(value));
    }

    public constructor(private readonly renderer: Renderer2, private readonly elementRef: ElementRef<RadioGroup>) {}
}
