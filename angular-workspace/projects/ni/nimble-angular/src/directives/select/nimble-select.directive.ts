import { Directive, ElementRef, forwardRef, HostListener, Input, Renderer2 } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Select } from '@ni/nimble-components/dist/esm/select';

@Directive({
    selector: 'nimble-select',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => NimbleSelectDirective),
            multi: true
        }
    ]
})
export class NimbleSelectDirective implements ControlValueAccessor {
    @Input() public disabled: boolean;

    private onTouched: () => void;
    private onChange: (string) => void;

    public constructor(private readonly elementRef: ElementRef<Select>, private readonly renderer: Renderer2) { }

    public writeValue(value: string): void {
        this.renderer.setProperty(this.elementRef.nativeElement, 'value', value);

        // Workaround for https://github.com/microsoft/fast/issues/5139
        // The Angular value binding sets the initial value before the FAST select has initialized its options property.
        // We set the selected attribute on the appropriate option element to make sure the initial value is set correctly.
        if (this.elementRef.nativeElement.options.length === 0 && value !== null) {
            const matchingOption = this.elementRef.nativeElement.querySelector(`nimble-listbox-option[value="${value}"]`);
            if (matchingOption !== null) {
                this.renderer.setAttribute(matchingOption, 'selected', '');
            }
        }
    }

    public registerOnChange(fn: (string) => void): void {
        this.onChange = fn;
    }

    public registerOnTouched(fn: () => void): void {
        this.onTouched = fn;
    }

    public setDisabledState?(isDisabled: boolean): void {
        this.renderer.setProperty(this.elementRef.nativeElement, 'disabled', isDisabled);
    }

    @HostListener('change')
    private changeListener(): void {
        this.onChange(this.elementRef.nativeElement.value);
        this.onTouched();
    }
}
