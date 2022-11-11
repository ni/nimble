import { Directive, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR, CheckboxControlValueAccessor } from '@angular/forms';

/**
 * Extension of Angular's CheckboxControlValueAccessor to target the Nimble checkbox control.
 *
 * Directive decorator based on CheckboxControlValueAccessor decorator
 * https://github.com/angular/angular/blob/bbababe5900ea8f4c8fccd88238f6fe08a2ceb63/packages/forms/src/directives/checkbox_value_accessor.ts#L42
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
