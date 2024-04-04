import { Directive, ElementRef, Input, Renderer2 } from '@angular/core';
import { type DatePicker, datePickerTag } from '@ni/nimble-components/dist/esm/date-picker';

export type { DatePicker };
export { datePickerTag };

/**
 * Directive to provide Angular integration for the table element.
 */
@Directive({
    selector: 'nimble-date-picker'
})
export class NimbleDatePickerDirective {
    public get value(): string {
        return this.elementRef.nativeElement.value;
    }

    @Input() public set value(value: string) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'value', value);
    }

    public get locale(): string {
        return this.elementRef.nativeElement.locale;
    }

    @Input() public set locale(value: string) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'locale', value);
    }

    public constructor(private readonly renderer: Renderer2, private readonly elementRef: ElementRef<DatePicker>) {}
}
