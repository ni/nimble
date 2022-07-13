import { Directive, ElementRef, forwardRef, Input, Renderer2 } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

/**
 * Control Value Accessor implementation to target combobox inputs.
 *
 * Directive decorator based on DefaultValueAccessor decorator
 * https://github.com/angular/angular/blob/master/packages/forms/src/directives/default_value_accessor.ts#L72
 */
@Directive({
    selector:
      'nimble-combobox[formControlName],nimble-combobox[formControl],nimble-combobox[ngModel]',
    // The following host metadata is duplicated from DefaultValueAccessor
    // eslint-disable-next-line @angular-eslint/no-host-metadata-property
    host: {
        '(change)': 'onChange($event.target.value)',
        '(blur)': 'onTouched()'
    },
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

    /**
     * Maps the provided ngValue to the expected display value. The provided function should additionally be used
     * to populate the content of each nimble-list-option within the nimble-combobox.
     */
    @Input()
    public set displayWith(fn: (value: unknown) => string) {
        if (typeof fn !== 'function') {
            throw new Error(`displayWith must be a function, but received ${JSON.stringify(fn)}`);
        }
        this._displayWith = fn;
    }

    public get displayWith(): (value: unknown) => string {
        return this._displayWith;
    }

    /** @internal */
    public readonly _optionMap: Map<string, unknown> = new Map<string, unknown>();

    private value: unknown;

    private _compareWith: (o1: unknown, o2: unknown) => boolean = Object.is;

    /**
     * The registered callback function called when a change or input event occurs on the input
     * element.
     * @nodoc
     */
    private onChange: (_: string) => void;

    /**
      * The registered callback function called when a blur event occurs on the input element.
      * @nodoc
      */
    private onTouched: () => void;

    public constructor(private readonly _renderer: Renderer2, private readonly _elementRef: ElementRef) {}

    /**
     * Updates the underlying nimble-combobox value with the expected display string.
     * @param value The ngValue set on the nimble-combobox
     */
    public writeValue(value: unknown): void {
        this.setProperty('value', this.displayWith(value));
    }

    /**
     * Registers a function called when the control value changes.
     * @nodoc
     */
    public registerOnChange(fn: (value: unknown) => void): void {
        this.onChange = (valueString: string): void => {
            this.value = this._optionMap.get(valueString) ?? Symbol(valueString);
            fn(this.value);
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
     * Helper method that sets a property on a target element using the current Renderer
     * implementation.
     * @nodoc
     */
    private setProperty(key: string, value: string): void {
        this._renderer.setProperty(this._elementRef.nativeElement, key, value);
    }

    private _displayWith: ((value: unknown) => string) = (value => {
        if (typeof value === 'string') {
            return value;
        }

        if (value === null || value === undefined) {
            return '';
        }

        throw new Error('Unknown value type requires custom `displayWith` override');
    });
}