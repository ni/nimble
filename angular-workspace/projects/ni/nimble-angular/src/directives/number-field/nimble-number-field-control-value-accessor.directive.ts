import { Directive, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR, NumberValueAccessor } from '@angular/forms';

/**
 * Extension of Angular's NumberValueAccessor to target the number-based inputs.
 *
 * Directive decorator based on NumberValueAccessor decorator
 * https://github.com/angular/angular/blob/master/packages/forms/src/directives/number_value_accessor.ts#L43
 */
@Directive({
    selector:
        'nimble-number-field[formControlName],nimble-number-field[formControl],nimble-number-field[ngModel]',
    // The following host metadata is duplicated from NumberValueAccessor
    // eslint-disable-next-line @angular-eslint/no-host-metadata-property, @typescript-eslint/naming-convention
    host: { '(input)': 'onChange($event.target.value)', '(blur)': 'onTouched()' },
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => NimbleNumberFieldControlValueAccessorDirective),
        multi: true
    }]
})
export class NimbleNumberFieldControlValueAccessorDirective extends NumberValueAccessor {}