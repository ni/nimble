/**
 * [Nimble]
 * Copied from https://github.com/angular/angular/blob/15.2.10/packages/forms/src/directives/number_value_accessor.ts
 * with the following modifications:
 * - Update imports
 * - Remove all configuration from NumberValueAccessor's `@Directive` decorator
 */


/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {Directive} from '@angular/core';

import type { ControlValueAccessor } from '@angular/forms';
import { BuiltInControlValueAccessor } from './control_value_accessor';

/* [Nimble] Do not register as a value accessor provider
const NUMBER_VALUE_ACCESSOR: Provider = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => NumberValueAccessor),
  multi: true
};
*/

/**
 * @description
 * The `ControlValueAccessor` for writing a number value and listening to number input changes.
 * The value accessor is used by the `FormControlDirective`, `FormControlName`, and `NgModel`
 * directives.
 *
 * @usageNotes
 *
 * ### Using a number input with a reactive form.
 *
 * The following example shows how to use a number input with a reactive form.
 *
 * ```ts
 * const totalCountControl = new FormControl();
 * ```
 *
 * ```
 * <input type="number" [formControl]="totalCountControl">
 * ```
 *
 * @ngModule ReactiveFormsModule
 * @ngModule FormsModule
 * @publicApi
 */
/* [Nimble] Remove all configuration from @Directive decorator
@Directive({
  selector:
      'input[type=number][formControlName],input[type=number][formControl],input[type=number][ngModel]',
  host: {'(input)': 'onChange($event.target.value)', '(blur)': 'onTouched()'},
  providers: [NUMBER_VALUE_ACCESSOR]
})
*/
@Directive()
export class NumberValueAccessor extends BuiltInControlValueAccessor implements
    ControlValueAccessor {
  /**
   * Sets the "value" property on the input element.
   * @nodoc
   */
  writeValue(value: number): void {
    // The value needs to be normalized for IE9, otherwise it is set to 'null' when null
    const normalizedValue = value == null ? '' : value;
    this.setProperty('value', normalizedValue);
  }

  /**
   * Registers a function called when the control value changes.
   * @nodoc
   */
  override registerOnChange(fn: (_: number|null) => void): void {
    this.onChange = (value) => {
      fn(value == '' ? null : parseFloat(value));
    };
  }
}
