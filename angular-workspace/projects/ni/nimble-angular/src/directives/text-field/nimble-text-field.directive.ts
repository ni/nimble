import { Directive, ElementRef, forwardRef, HostBinding, HostListener, Input, Renderer2 } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { TextField } from '@ni/nimble-components/dist/esm/text-field';

@Directive({
    selector: 'nimble-text-field',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => NimbleTextFieldDirective),
            multi: true
        }
    ]
})
export class NimbleTextFieldDirective implements ControlValueAccessor {
    @HostBinding('attr.disabled') @Input() public disabled: boolean;
    @HostBinding('attr.invalid') @Input() public invalid: boolean;
    @HostBinding('attr.readonly') @Input() public readonly: boolean;

    private onTouched: () => void;
    private onChange: (string) => void;

    public constructor(private readonly elementRef: ElementRef<TextField>, private readonly renderer: Renderer2) { }

    public writeValue(value: string): void {
        this.renderer.setProperty(this.elementRef.nativeElement, 'value', value);
    }

    public registerOnChange(callback: (string) => void): void {
        this.onChange = callback;
    }

    public registerOnTouched(callback: () => void): void {
        this.onTouched = callback;
    }

    public setDisabledState?(isDisabled: boolean): void {
        this.renderer.setProperty(this.elementRef.nativeElement, 'disabled', isDisabled);
    }

    @HostListener('input')
    private changeListener(): void {
        this.onChange(this.elementRef.nativeElement.value);
        this.onTouched();
    }
}
