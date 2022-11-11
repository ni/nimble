import { Directive, ElementRef, forwardRef, Injector, OnInit, Renderer2 } from '@angular/core';
// eslint-disable-next-line camelcase
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { RadioGroup } from '@ni/nimble-components/dist/esm/radio-group';
import type { Radio } from '@ni/nimble-components/dist/esm/radio';
import { RadioControlValueAccessor, RadioControlRegistry } from '../../thirdparty/directives/radio_control_value_accessor';

/**
 * Control Value Accessor implementation for the radio group.
 */
@Directive({
    selector:
        'nimble-radio[formControlName],nimble-radio[formControl],nimble-radio[ngModel]',
    // The following host metadata is duplicated from RadioControlValueAccessor
    // eslint-disable-next-line @angular-eslint/no-host-metadata-property, @typescript-eslint/naming-convention
    host: { '(change)': 'nimbleOnChange($event.target.checked)', '(blur)': 'onTouched()' },
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => NimbleRadioControlValueAccessorDirective),
        multi: true
    }]
})
export class NimbleRadioControlValueAccessorDirective extends RadioControlValueAccessor implements OnInit {
    private static _nextOpenId = 0;
    private _privateOnChange?: () => void;

    public constructor(renderer: Renderer2, private readonly elementRef: ElementRef, _registry: RadioControlRegistry, _injector: Injector) {
        super(renderer, elementRef, _registry, _injector);
    }

    private static allocateId(): string {
        const id = NimbleRadioControlValueAccessorDirective._nextOpenId.toString();
        NimbleRadioControlValueAccessorDirective._nextOpenId += 1;
        return id;
    }

    public override ngOnInit(): void {
        super.ngOnInit();
        // We need each button element to have a unique string value, because the FAST radio group looks at
        // these values when trying to manage the checked state.
        (this.elementRef.nativeElement as Radio).value = NimbleRadioControlValueAccessorDirective.allocateId();
    }

    /**
     * Sets the "checked" property value on the radio input element.
     * @nodoc
     */
    public override writeValue(value: unknown): void {
        super.writeValue(value);
        const parentGroup = (this.elementRef.nativeElement as Radio).parentElement;
        if (this.value === value && parentGroup && parentGroup instanceof RadioGroup) {
            // This is a workaround to a problem where all of the buttons are initialized as unchecked.
            // The radio group tries to synchronize its value and the checked states of the radio buttons.
            // In response to the slotchange DOM event, the radio group sets the checked state of each
            // newly slotted button, based on whether the button's value matches the group's value.
            // If the group's value is uninitialized, it unchecks all radio buttons.
            // Unfortunately, this occurs _after_ the CVA initializes the checked state of each radio
            // button, meaning the initially checked button gets unchecked by the group. To avoid this,
            // we need to set the group's value to match the checked button.
            parentGroup.value = (this.elementRef.nativeElement as Radio).value;
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