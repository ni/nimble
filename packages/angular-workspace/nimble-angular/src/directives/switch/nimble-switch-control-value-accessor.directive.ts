import { Directive, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { CheckboxControlValueAccessor } from '../../thirdparty/directives/checkbox_value_accessor';

/**
 * Extension of Angular's CheckboxControlValueAccessor to target the Nimble switch control.
 *
 * Directive decorator based on CheckboxControlValueAccessor decorator in thirdparty/directives/checkbox_value_accessor
 */
@Directive({
    selector:
        'nimble-switch[formControlName],nimble-switch[formControl],nimble-switch[ngModel]',
    // The following host metadata is duplicated from CheckboxControlValueAccessor
    // eslint-disable-next-line @angular-eslint/no-host-metadata-property, @typescript-eslint/naming-convention
    host: { '(change)': 'onChange($event.target.checked)', '(blur)': 'onTouched()' },
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => NimbleSwitchControlValueAccessorDirective),
        multi: true
    }]
})
export class NimbleSwitchControlValueAccessorDirective extends CheckboxControlValueAccessor {
}
