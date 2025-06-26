import { Directive, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { CheckboxControlValueAccessor } from '../../thirdparty/directives/checkbox_value_accessor';

/**
 * Extension of Angular's CheckboxControlValueAccessor to target the Nimble checkbox control.
 *
 * Directive decorator based on CheckboxControlValueAccessor decorator in thirdparty/directives/checkbox_value_accessor
 */
@Directive({
    selector:
      'nimble-checkbox[formControlName],nimble-checkbox[formControl],nimble-checkbox[ngModel]',
    // The following host metadata is duplicated from CheckboxControlValueAccessor
    // eslint-disable-next-line @angular-eslint/no-host-metadata-property, @typescript-eslint/naming-convention
    host: { '(change)': 'onChange($event.target.checked)', '(blur)': 'onTouched()' },
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => NimbleCheckboxControlValueAccessorDirective),
        multi: true
    }]
})
export class NimbleCheckboxControlValueAccessorDirective extends CheckboxControlValueAccessor {
}
