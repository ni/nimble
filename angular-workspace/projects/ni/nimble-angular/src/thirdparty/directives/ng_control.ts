/**
 * Copied from https://github.com/angular/angular/blob/e9b5dac9ecaa86914079a37176985c628c403aba/packages/forms/src/directives/ng_control.ts
 * with the following modifications:
 * - Change import of ControlValueAccessor to type import
 */

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {AbstractControlDirective, ControlContainer} from '@angular/forms';
import type {ControlValueAccessor} from './control_value_accessor';


/**
 * @description
 * A base class that all `FormControl`-based directives extend. It binds a `FormControl`
 * object to a DOM element.
 *
 * @publicApi
 */
export abstract class NgControl extends AbstractControlDirective {
  /**
   * @description
   * The parent form for the control.
   *
   * @internal
   */
  _parent: ControlContainer|null = null;

  /**
   * @description
   * The name for the control
   */
  name: string|number|null = null;

  /**
   * @description
   * The value accessor for the control
   */
  valueAccessor: ControlValueAccessor|null = null;

  /**
   * @description
   * The callback method to update the model from the view when requested
   *
   * @param newValue The new value for the view
   */
  abstract viewToModelUpdate(newValue: any): void;
}