import { Directive, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR, CheckboxControlValueAccessor } from '@angular/forms';

/**
 * Extension of Angular's CheckboxControlValueAccessor to target the Nimble toggle button control.
 *
 * Directive decorator based on CheckboxControlValueAccessor decorator
 * https://github.com/angular/angular/blob/bbababe5900ea8f4c8fccd88238f6fe08a2ceb63/packages/forms/src/directives/checkbox_value_accessor.ts#L42
 */
@Directive({
    selector:
        'nimble-toggle-button[formControlName],nimble-toggle-button[formControl],nimble-toggle-button[ngModel]',
    // The following host metadata is duplicated from CheckboxControlValueAccessor
    // eslint-disable-next-line @angular-eslint/no-host-metadata-property, @typescript-eslint/naming-convention
    host: { '(change)': 'onChange($event.target.checked)', '(blur)': 'onTouched()' },
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => NimbleToggleButtonControlValueAccessorDirective),
        multi: true
    }]
})
export class NimbleToggleButtonControlValueAccessorDirective extends CheckboxControlValueAccessor {
}
