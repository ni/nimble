/**
 * [Nimble]
 * Copied from https://github.com/angular/angular/blob/19.2.15/packages/forms/src/directives/checkbox_value_accessor.ts
 * with the following modifications:
 * - Update imports
 * - Remove all configuration from the CheckboxControlValueAccessor's `@Directive` decorator
 */

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */

import {Directive, forwardRef, type Provider} from '@angular/core';

import {
  BuiltInControlValueAccessor,
  // ControlValueAccessor,
  // NG_VALUE_ACCESSOR,
} from './control_value_accessor';
import type {ControlValueAccessor} from '@angular/forms';

/* [Nimble] Do not register as a value accessor provider
const CHECKBOX_VALUE_ACCESSOR: Provider = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => CheckboxControlValueAccessor),
  multi: true,
};
*/

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
 * ```html
 * <input type="checkbox" [formControl]="rememberLoginControl">
 * ```
 *
 * @ngModule ReactiveFormsModule
 * @ngModule FormsModule
 * @publicApi
 */
// [Nimble] Remove configuration from @Directive decorator
@Directive({
  // selector:
  //   'input[type=checkbox][formControlName],input[type=checkbox][formControl],input[type=checkbox][ngModel]',
  // host: {'(change)': 'onChange($event.target.checked)', '(blur)': 'onTouched()'},
  // providers: [CHECKBOX_VALUE_ACCESSOR],
  standalone: false,
})
export class CheckboxControlValueAccessor
  extends BuiltInControlValueAccessor
  implements ControlValueAccessor
{
  /**
   * Sets the "checked" property on the input element.
   * @docs-private
   */
  writeValue(value: any): void {
    this.setProperty('checked', value);
  }
}