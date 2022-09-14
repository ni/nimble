import { Directive, ElementRef, forwardRef, HostListener, Renderer2 } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

/**
 * Control Value Accessor implementation for the radio group.
 * @description
 * The underlying native elements only support string values, so in order to support other types, we
 * manage a mapping of generated string values to the bound values. I.e. we generate "ID" aliases for
 * each radio button, which is then mapped to the value bound to ngValue. The writeValue function and
 * onChange callback handle the translation from IDs to actual values.
 */
@Directive({
    selector:
        'nimble-radio-group[formControlName],nimble-radio-group[formControl],nimble-radio-group[ngModel]',
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => NimbleRadioGroupControlValueAccessorDirective),
        multi: true
    }]
})
export class NimbleRadioGroupControlValueAccessorDirective implements ControlValueAccessor {
    private _buttonIdCounter = 0;
    // Maps from a element value (i.e. button "ID") to a FormControl value
    private readonly _buttonMap: Map<string, unknown> = new Map<string, unknown>();
    private _cachedValue: unknown;
    private _valueIsCached = false;

    public constructor(private readonly _renderer: Renderer2, private readonly _elementRef: ElementRef) {}

    /**
     * Updates the underlying radio group value.
     * @param value The model value set on the nimble-radio-group
     */
    public writeValue(value: unknown): void {
        const id = this.findIdForValue(value);
        // In a reactive form, the initial FormControl value may be set before the template
        // is fully parsed, and the child radio buttons have been added. When that happens,
        // we cache the FormControl value, and defer setting the value on the native element
        // until the matching radio button is added.
        if (id === null) {
            this._cachedValue = value;
            this._valueIsCached = true;
        } else {
            this._renderer.setProperty(this._elementRef.nativeElement, 'value', id);
        }
    }

    /**
     * Registers a function called when the control value changes.
     * @nodoc
     */
    public registerOnChange(fn: (value: unknown) => void): void {
        this.onChange = (id: string): void => {
            fn(this._buttonMap.get(id));
        };
    }

    /**
     * Registers a function called when the control is touched.
     * @nodoc
     */
    public registerOnTouched(fn: () => void): void {
        this.onTouched = fn;
    }

    /**
     * @internal
     */
    public getRadioButtonId(): string {
        this._buttonIdCounter += 1;
        return this._buttonIdCounter.toString();
    }

    /**
     * @internal
     */
    public addRadioButton(id: string, value: unknown): void {
        this._buttonMap.set(id, value);
        if (this._valueIsCached && this._cachedValue === value) {
            this.writeValue(value);
            this._cachedValue = null;
            this._valueIsCached = false;
        }
    }

    /**
     * @internal
     */
    public removeRadioButton(id: string): void {
        this._buttonMap.delete(id);
    }

    private findIdForValue(value: unknown): string | null {
        for (const id of Array.from(this._buttonMap.keys())) {
            if (this._buttonMap.get(id) === value) {
                return id;
            }
        }
        return null;
    }

    /**
     * The registered callback function called when a change event occurs on a radio button
     * element.
     * @nodoc
     */
    @HostListener('change', ['$event.target.value]'])
    private onChange = (_: string): void => {};

    /**
      * The registered callback function called when a blur event occurs on a radio button
      * element.
      * @nodoc
      */
    @HostListener('blur')
    private onTouched = (): void => {};
}