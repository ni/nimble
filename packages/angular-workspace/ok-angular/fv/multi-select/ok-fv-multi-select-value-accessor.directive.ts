import { Directive, ElementRef, forwardRef, HostListener, Renderer2 } from '@angular/core';
import { type ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import type { FvMultiSelect } from '@ni/ok-components/dist/esm/fv/multi-select';

/** Angular form value accessor for the FV multi-select. */
@Directive({
    selector: 'ok-fv-multi-select[formControlName],ok-fv-multi-select[formControl],ok-fv-multi-select[ngModel]',
    providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => OkFvMultiSelectValueAccessor), multi: true }],
    standalone: false
})
export class OkFvMultiSelectValueAccessor implements ControlValueAccessor {
    public constructor(private readonly elementRef: ElementRef<FvMultiSelect>, private readonly renderer: Renderer2) {}

    public writeValue(value: string[] | null): void {
        this.renderer.setProperty(this.elementRef.nativeElement, 'selectedValues', value ?? []);
    }

    public registerOnChange(fn: (value: string[]) => void): void {
        this.onChange = fn;
    }

    public registerOnTouched(fn: () => void): void {
        this.onTouched = fn;
    }

    public setDisabledState(disabled: boolean): void {
        this.renderer.setProperty(this.elementRef.nativeElement, 'disabled', disabled);
    }

    @HostListener('input', ['$event'])
    public handleInput(event: Event): void {
        if (event.target === this.elementRef.nativeElement) {
            this.onChange(this.elementRef.nativeElement.selectedValues);
        }
    }

    @HostListener('blur')
    public handleBlur(): void {
        this.onTouched();
    }

    private onChange: (value: string[]) => void = () => {};
    private onTouched: () => void = () => {};
}
