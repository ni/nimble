import { Directive, ElementRef, Input, Renderer2 } from '@angular/core';
import type { Checkbox } from '@ni/nimble-components/dist/esm/checkbox';
import { BooleanValueOrAttribute, toBooleanProperty } from '@ni/nimble-angular/internal-utilities';

export type { Checkbox };

/**
 * Directive to provide Angular integration for the checkbox.
 */
@Directive({
    selector: 'nimble-checkbox'
})
export class NimbleCheckboxDirective {
    public get disabled(): boolean {
        return this.elementRef.nativeElement.disabled;
    }

    @Input() public set disabled(value: BooleanValueOrAttribute) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'disabled', toBooleanProperty(value));
    }

    public get checked(): boolean {
        return this.elementRef.nativeElement.checked;
    }

    @Input() public set checked(value: BooleanValueOrAttribute) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'checked', toBooleanProperty(value));
    }

    public get indeterminate(): boolean {
        return this.elementRef.nativeElement.indeterminate;
    }

    @Input() public set indeterminate(value: BooleanValueOrAttribute) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'indeterminate', toBooleanProperty(value));
    }

    public constructor(private readonly renderer: Renderer2, private readonly elementRef: ElementRef<Checkbox>) {}
}
