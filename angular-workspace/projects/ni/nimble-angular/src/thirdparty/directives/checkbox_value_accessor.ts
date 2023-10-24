/**
 * [Nimble]
 * Copied from https://github.com/angular/angular/blob/035aee01089b9f9d4b5b6af66a74002e07723fba/packages/forms/src/directives/checkbox_value_accessor.ts
 * with minimal modifications.
 */


/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {Directive, forwardRef, Provider} from '@angular/core';

// [Nimble] Update imports
// import {BuiltInControlValueAccessor, ControlValueAccessor, NG_VALUE_ACCESSOR} from './control_value_accessor';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { BuiltInControlValueAccessor } from './control_value_accessor';

const CHECKBOX_VALUE_ACCESSOR: Provider = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => CheckboxControlValueAccessor),
  multi: true,
};

/**
 * @description
 * A `ControlValueAccessor` for writing a value and listening to changes on a checkbox input
 * element.
 *
 * @usageNotes
 *
 * ### Using a checkbox with a reactive form.
 *
 * The following example shows how to use a checkbox with a reactive form.
 *
 * ```ts
 * const rememberLoginControl = new FormControl();
 * ```
 *
 * ```
 * <input type="checkbox" [formControl]="rememberLoginControl">
 * ```
 *
 * @ngModule ReactiveFormsModule
 * @ngModule FormsModule
 * @publicApi
 */
@Directive({
  selector:
      'input[type=checkbox][formControlName],input[type=checkbox][formControl],input[type=checkbox][ngModel]',
  host: {'(change)': 'onChange($event.target.checked)', '(blur)': 'onTouched()'},
  providers: [CHECKBOX_VALUE_ACCESSOR]
})
export class CheckboxControlValueAccessor extends BuiltInControlValueAccessor implements
    ControlValueAccessor {
  /**
   * Sets the "checked" property on the input element.
   * @nodoc
   */
  writeValue(value: any): void {
    this.setProperty('checked', value);
  }
}
