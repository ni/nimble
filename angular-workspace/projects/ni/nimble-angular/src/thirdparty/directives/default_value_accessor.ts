/**
 * [Nimble]
 * Copied from https://github.com/angular/angular/blob/035aee01089b9f9d4b5b6af66a74002e07723fba/packages/forms/src/directives/default_value_accessor.ts
 * with minimal modifications.
 */

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {Directive, ElementRef, Inject, Optional, Renderer2} from '@angular/core';

import { ControlValueAccessor, COMPOSITION_BUFFER_MODE } from '@angular/forms';
import { BaseControlValueAccessor } from './control_value_accessor';

/* [Nimble] Do not register as a default value accessor provider
export const DEFAULT_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => DefaultValueAccessor),
  multi: true
};
*/

/**
 * We must check whether the agent is Android because composition events
 * behave differently between iOS and Android.
 */
function _isAndroid(): boolean {
  // [Nimble] Get user agent without using private Angular APIs
  // const userAgent = getDOM() ? getDOM().getUserAgent() : '';
  const userAgent = window.navigator.userAgent;
  return /android (\d+)/.test(userAgent.toLowerCase());
}

/* [Nimble] Pulled from Angular forms instead
/**
 * @description
 * Provide this token to control if form directives buffer IME input until
 * the "compositionend" event occurs.
 * @publicApi
 *
export const COMPOSITION_BUFFER_MODE = new InjectionToken<boolean>('CompositionEventMode');
*/

/**
 * The default `ControlValueAccessor` for writing a value and listening to changes on input
 * elements. The accessor is used by the `FormControlDirective`, `FormControlName`, and
 * `NgModel` directives.
 *
 * {@searchKeywords ngDefaultControl}
 *
 * @usageNotes
 *
 * ### Using the default value accessor
 *
 * The following example shows how to use an input element that activates the default value accessor
 * (in this case, a text field).
 *
 * ```ts
 * const firstNameControl = new FormControl();
 * ```
 *
 * ```
 * <input type="text" [formControl]="firstNameControl">
 * ```
 *
 * This value accessor is used by default for `<input type="text">` and `<textarea>` elements, but
 * you could also use it for custom components that have similar behavior and do not require special
 * processing. In order to attach the default value accessor to a custom element, add the
 * `ngDefaultControl` attribute as shown below.
 *
 * ```
 * <custom-input-component ngDefaultControl [(ngModel)]="value"></custom-input-component>
 * ```
 *
 * @ngModule ReactiveFormsModule
 * @ngModule FormsModule
 * @publicApi
 */
/* [Nimble] Remove all configuration from @Directive decorator
@Directive({
  selector:
      'input:not([type=checkbox])[formControlName],textarea[formControlName],input:not([type=checkbox])[formControl],textarea[formControl],input:not([type=checkbox])[ngModel],textarea[ngModel],[ngDefaultControl]',
  // TODO: vsavkin replace the above selector with the one below it once
  // https://github.com/angular/angular/issues/3011 is implemented
  // selector: '[ngModel],[formControl],[formControlName]',
  host: {
    '(input)': '$any(this)._handleInput($event.target.value)',
    '(blur)': 'onTouched()',
    '(compositionstart)': '$any(this)._compositionStart()',
    '(compositionend)': '$any(this)._compositionEnd($event.target.value)'
  },
  providers: [DEFAULT_VALUE_ACCESSOR]
})
*/
@Directive()
export class DefaultValueAccessor extends BaseControlValueAccessor implements ControlValueAccessor {
  /** Whether the user is creating a composition string (IME events). */
  private _composing = false;

  constructor(
      renderer: Renderer2, elementRef: ElementRef,
      @Optional() @Inject(COMPOSITION_BUFFER_MODE) private _compositionMode: boolean) {
    super(renderer, elementRef);
    if (this._compositionMode == null) {
      this._compositionMode = !_isAndroid();
    }
  }

  /**
   * Sets the "value" property on the input element.
   * @nodoc
   */
  writeValue(value: any): void {
    const normalizedValue = value == null ? '' : value;
    this.setProperty('value', normalizedValue);
  }

  /** @internal */
  _handleInput(value: any): void {
    if (!this._compositionMode || (this._compositionMode && !this._composing)) {
      this.onChange(value);
    }
  }

  /** @internal */
  _compositionStart(): void {
    this._composing = true;
  }

  /** @internal */
  _compositionEnd(value: any): void {
    this._composing = false;
    this._compositionMode && this.onChange(value);
  }
}
