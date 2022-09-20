import { Directive, ElementRef, forwardRef, Host, Inject, Injector, OnInit, Optional, Renderer2 } from '@angular/core';
// eslint-disable-next-line camelcase
import { NG_VALUE_ACCESSOR, RadioControlValueAccessor, ɵangular_packages_forms_forms_r } from '@angular/forms';
import { NimbleRadioGroupDirective } from '../radio-group/nimble-radio-group.directive';
import type { RadioButton } from './nimble-radio-button.module';

/**
 * Control Value Accessor implementation for the radio group.
 */
@Directive({
    selector:
        'nimble-radio-button[formControlName],nimble-radio-button[formControl],nimble-radio-button[ngModel]',
    // The following host metadata is duplicated from RadioControlValueAccessor
    // eslint-disable-next-line @angular-eslint/no-host-metadata-property
    host: { '(change)': 'nimbleOnChange($event.target.checked)', '(blur)': 'onTouched()' },
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => NimbleRadioButtonControlValueAccessorDirective),
        multi: true
    }]
})
export class NimbleRadioButtonControlValueAccessorDirective extends RadioControlValueAccessor implements OnInit {
    private _privateOnChange?: () => void;

    // Type ɵangular_packages_forms_forms_r from base class isn't in camelcase
    // eslint-disable-next-line camelcase
    public constructor(renderer: Renderer2, private readonly elementRef: ElementRef, _registry: ɵangular_packages_forms_forms_r, _injector: Injector,
        @Inject(NimbleRadioGroupDirective) @Optional() @Host() private readonly _radioGroup?: NimbleRadioGroupDirective) {
        super(renderer, elementRef, _registry, _injector);
    }

    public ngOnInit(): void {
        if (this._radioGroup) {
            (this.elementRef.nativeElement as RadioButton).value = this._radioGroup.allocateId();
        }
    }

    /**
     * Sets the "checked" property value on the radio input element.
     * @nodoc
     */
    public override writeValue(value: unknown): void {
        super.writeValue(value);
        if (this.value === value && this._radioGroup) {
            this._radioGroup.value = (this.elementRef.nativeElement as RadioButton).value;
        }
    }

    // There is a bug in FAST (https://github.com/microsoft/fast/issues/6381) that prevents
    // RadioControlValueAccessor from working properly. The default onChange handler is supposed to be
    // called _only_ when radio buttons are checked, but the FAST bug causes it to be called when radio
    // buttons are _unchecked_, too.
    //
    // To work around this, we effectively disable the base class's onChange handler and replace it with
    // our own nimbleOnChange. NimbleOnChange calls the original onChange (now cached as _privateOnChange)
    // only if the changed item became checked.
    public nimbleOnChange(checked: boolean): void {
        if (checked && this._privateOnChange) {
            this._privateOnChange();
        }
    }

    public override registerOnChange(fn: (_: unknown) => { [key: string]: unknown }): void {
        super.registerOnChange(fn);
        this._privateOnChange = this.onChange;
        this.onChange = (): void => {};
    }
}