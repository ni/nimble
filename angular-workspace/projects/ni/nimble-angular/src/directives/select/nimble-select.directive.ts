import { Directive, ElementRef, forwardRef, HostListener, Input, OnInit, Renderer2 } from '@angular/core';
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

    public constructor(private elementRef: ElementRef<Select>, private renderer2: Renderer2) { }

    writeValue(value: any): void {
        this.renderer2.setProperty(this.elementRef.nativeElement, 'value', value);

        // Workaround for https://github.com/microsoft/fast/issues/5139
        // The Angular value binding sets the initial value before the FAST select has initialized its options property.
        // We set the selected attribute on the appropriate option element to make sure the initial value is set correctly.
        if (this.elementRef.nativeElement.options.length === 0 && value !== null) {
            const matchingOption = this.elementRef.nativeElement.querySelector(`nimble-listbox-option[value=${value}]`);
            if (matchingOption !== null) {
                this.renderer2.setAttribute(matchingOption, 'selected', '');
            }
        }
    }

    registerOnChange(fn: any): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }
    
    setDisabledState?(isDisabled: boolean): void {
        this.renderer2.setProperty(this.elementRef.nativeElement, 'disabled', isDisabled);
    }

    @HostListener('change')
    changeListener() {
        this.onChange(this.elementRef.nativeElement.value);
        this.onTouched();
    }

    private onTouched = (): void => {};
    private onChange = (value: string): void => {};
}
