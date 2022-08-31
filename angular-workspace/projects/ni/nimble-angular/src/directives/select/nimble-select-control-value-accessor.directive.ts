import { Directive, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR, SelectControlValueAccessor } from '@angular/forms';

/**
 * Extension of Angular's SelectControlValueAccessor to target the Nimble select control.
 *
 * @see NimbleSelectOptionDirective
 *
 * Directive decorator based on SelectControlValueAccessor decorator
 * https://github.com/angular/angular/blob/master/packages/forms/src/directives/select_control_value_accessor.ts#L85
 */
@Directive({
    selector:
      'nimble-select:not([multiple])[formControlName],nimble-select:not([multiple])[formControl],nimble-select:not([multiple])[ngModel]',
    // The following host metadata is duplicated from SelectControlValueAccessor
    // eslint-disable-next-line @angular-eslint/no-host-metadata-property, @typescript-eslint/naming-convention
    host: { '(change)': 'onChange($event.target.value)', '(blur)': 'onTouched()' },
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => NimbleSelectControlValueAccessorDirective),
        multi: true
    }]
})
export class NimbleSelectControlValueAccessorDirective extends SelectControlValueAccessor {
}
