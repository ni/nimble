import { Directive, ElementRef, forwardRef, HostListener, Input, Renderer2 } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export const notFoundSymbol = Symbol('not found');
/**
 * Control Value Accessor implementation to target combobox inputs.
 */
@Directive({
    selector:
      'nimble-combobox[formControlName],nimble-combobox[formControl],nimble-combobox[ngModel]',
    // eslint-disable-next-line @angular-eslint/no-host-metadata-property
    host: {
        '(change)': 'onChange($event.target.value)'
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
    @HostListener('blur')
    private onTouched: () => void;

    public constructor(private readonly _renderer: Renderer2, private readonly _elementRef: ElementRef) {}

    /**
     * Updates the underlying nimble-combobox value with the expected display string.
     * @param value The ngValue set on the nimble-combobox
     */
    public writeValue(value: unknown): void {
        const valueAsString = this.getValueStringFromValue(value);
        this.setProperty('value', valueAsString ?? '');
    }

    /**
     * Registers a function called when the control value changes.
     * @nodoc
     */
    public registerOnChange(fn: (value: unknown) => void): void {
        this.onChange = (valueString: string): void => {
            this.value = this._optionMap.get(valueString) ?? notFoundSymbol;
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

    private getValueStringFromValue(value: unknown): string | undefined {
        for (const optionValue of this._optionMap.values()) {
            if (this._compareWith(optionValue, value)) {
                return Array.from(this._optionMap.keys()).find(key => this._optionMap.get(key) === optionValue);
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