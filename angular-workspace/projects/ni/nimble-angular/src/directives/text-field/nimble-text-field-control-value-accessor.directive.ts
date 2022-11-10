import { Directive, forwardRef } from '@angular/core';
import { DefaultValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

/**
 * Extension of Angular's DefaultValueAccessor to target the text-based inputs.
 *
 * Directive decorator based on DefaultValueAccessor decorator
 * https://github.com/angular/angular/blob/master/packages/forms/src/directives/default_value_accessor.ts#L72
 */
@Directive({
    selector:
      'nimble-text-field[formControlName],nimble-text-field[formControl],nimble-text-field[ngModel]',
    // The following host metadata is duplicated from DefaultValueAccessor
    // eslint-disable-next-line @angular-eslint/no-host-metadata-property
    host: {
        /* eslint-disable @typescript-eslint/naming-convention */
        '(input)': '$any(this)._handleInput($event.target.value)',
        '(blur)': 'onTouched()',
        '(compositionstart)': '$any(this)._compositionStart()',
        '(compositionend)': '$any(this)._compositionEnd($event.target.value)'
        /* eslint-enable @typescript-eslint/naming-convention */
    },
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => NimbleTextFieldControlValueAccessorDirective),
        multi: true
    }]
})
export class NimbleTextFieldControlValueAccessorDirective extends DefaultValueAccessor {}