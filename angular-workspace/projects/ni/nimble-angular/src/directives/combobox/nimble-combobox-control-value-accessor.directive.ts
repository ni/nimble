import { Directive, ElementRef, forwardRef, HostListener, Input, Renderer2 } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

/**
* @description
* This symbol instance will be returned when the value input of the Combobox is set
* to a value not found in the set of options.
*/
export const OPTION_NOT_FOUND: unique symbol = Symbol('not found');
export type OptionNotFound = typeof OPTION_NOT_FOUND;

/**
 * Control Value Accessor implementation to target combobox inputs.
 * @description
 * The expectation when binding value via 'ngModel', is that the content in each list-option be
 * unique. When this isn't the case the behavior is undefined. Additionally, it is expected
 * that when using 'ngModel' that each list-option bind a value via 'ngValue', and not 'value'.
 */
@Directive({
    selector:
      'nimble-combobox[formControlName],nimble-combobox[formControl],nimble-combobox[ngModel]',
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => NimbleComboboxControlValueAccessorDirective),
        multi: true
    }]
})
export class NimbleComboboxControlValueAccessorDirective implements ControlValueAccessor {
    /**
     * @description
     * Tracks the option comparison algorithm for tracking identities when
     * checking for changes.
     */
    @Input()
    public set compareWith(fn: (o1: unknown, o2: unknown) => boolean) {
        if (typeof fn !== 'function') {
            throw new Error(`compareWith must be a function, but received ${JSON.stringify(fn)}`);
        }
        this._compareWith = fn;
    }

    private readonly _optionMap: Map<string, unknown> = new Map<string, unknown>();

    private _modelValue: unknown;

    private _compareWith: (o1: unknown, o2: unknown) => boolean = Object.is;

    /**
     * The registered callback function called when a change or input event occurs on the input
     * element.
     * @nodoc
     */
    @HostListener('input', ['$event.target.control.value]'])
    @HostListener('change', ['$event.target.value]'])
    private onChange: (_: string) => void;

    /**
      * The registered callback function called when a blur event occurs on the input element.
      * @nodoc
      */
    @HostListener('blur')
    private onTouched: () => void;

    public constructor(private readonly _renderer: Renderer2, private readonly _elementRef: ElementRef) {}

    /**
     * Updates the underlying nimble-combobox value with the expected display string.
     * @param value The ngValue set on the nimble-combobox
     */
    public writeValue(value: unknown): void {
        this._modelValue = value;
        this.updateDisplayValue();
    }

    /**
     * Registers a function called when the control value changes.
     * @nodoc
     */
    public registerOnChange(fn: (value: unknown) => void): void {
        this.onChange = (valueString: string): void => {
            const modelValue = this._optionMap.has(valueString) ? this._optionMap.get(valueString) : OPTION_NOT_FOUND;
            this._modelValue = modelValue;
            fn(modelValue);
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
    public addOption(displayValue: string, modelValue: unknown): void {
        this._optionMap.set(displayValue, modelValue);
        this.updateDisplayValue();
    }

    /**
     * @internal
     */
    public removeOption(displayValue: string): void {
        this._optionMap.delete(displayValue);
    }

    private updateDisplayValue(): void {
        const valueAsString = this.getValueStringFromValue(this._modelValue);
        this.setProperty('value', valueAsString ?? '');
    }

    private getValueStringFromValue(value: unknown): string | undefined {
        for (const [optionKey, optionValue] of this._optionMap.entries()) {
            if (this._compareWith(optionValue, value)) {
                return optionKey;
            }
        }
        return undefined;
    }

    /**
     * Helper method that sets a property on a target element using the current Renderer
     * implementation.
     * @nodoc
     */
    private setProperty(key: string, value: string): void {
        this._renderer.setProperty(this._elementRef.nativeElement, key, value);
    }
}
