/**
 * The code in this file is almost entirely copied from the BaseControlValueAccessor and
 * the DefaultValueAccessor in the Angular source.
 *
 * https://github.com/angular/angular/blob/478131c519cd3e12fbede458d5c6ecdc1ca0c9ce/packages/forms/src/directives/default_value_accessor.ts
 * https://github.com/angular/angular/blob/478131c519cd3e12fbede458d5c6ecdc1ca0c9ce/packages/forms/src/directives/control_value_accessor.ts
 *
 * Adding this directive to a component makes it so consumers of the component don't have
 * to specify an "ngDefaultControl" attribute every time they use it with value binding.
 *
 * At this time there doesn't seem to be a good way to extend a directive with another
 * directive, or to add a directive to the host element of another directive. So the next
 * best solution is to copy the code to our repo and use our own selectors in the directive
 * decorator.
 *
 * See this issue: https://github.com/angular/angular/issues/8785#issuecomment-726755076
 */

/* eslint-disable */

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

 import {ɵgetDOM as getDOM} from '@angular/common';
 import {Directive, ElementRef, forwardRef, Inject, InjectionToken, Optional, Renderer2} from '@angular/core';
 import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';

 /**
 * Base class for all ControlValueAccessor classes defined in Forms package.
 * Contains common logic and utility functions.
 *
 * Note: this is an *internal-only* class and should not be extended or used directly in
 * applications code.
 */
  @Directive()
  export class BaseControlValueAccessor {
    /**
     * The registered callback function called when a change or input event occurs on the input
     * element.
     * @nodoc
     */
    onChange = (_: any) => {};
  
    /**
     * The registered callback function called when a blur event occurs on the input element.
     * @nodoc
     */
    onTouched = () => {};
  
    constructor(private _renderer: Renderer2, private _elementRef: ElementRef) {}
  
    /**
     * Helper method that sets a property on a target element using the current Renderer
     * implementation.
     * @nodoc
     */
    protected setProperty(key: string, value: any): void {
      this._renderer.setProperty(this._elementRef.nativeElement, key, value);
    }
  
    /**
     * Registers a function called when the control is touched.
     * @nodoc
     */
    registerOnTouched(fn: () => void): void {
      this.onTouched = fn;
    }
  
    /**
     * Registers a function called when the control value changes.
     * @nodoc
     */
    registerOnChange(fn: (_: any) => {}): void {
      this.onChange = fn;
    }
  
    /**
     * Sets the "disabled" property on the range input element.
     * @nodoc
     */
    setDisabledState(isDisabled: boolean): void {
      this.setProperty('disabled', isDisabled);
    }
  }

 export const DEFAULT_VALUE_ACCESSOR: any = {
   provide: NG_VALUE_ACCESSOR,
   useExisting: forwardRef(() => NimbleControlValueAccessor),
   multi: true
 };
 
 /**
  * We must check whether the agent is Android because composition events
  * behave differently between iOS and Android.
  */
 function _isAndroid(): boolean {
   const userAgent = getDOM() ? getDOM().getUserAgent() : '';
   return /android (\d+)/.test(userAgent.toLowerCase());
 }
 
 /**
  * @description
  * Provide this token to control if form directives buffer IME input until
  * the "compositionend" event occurs.
  * @publicApi
  */
 export const COMPOSITION_BUFFER_MODE = new InjectionToken<boolean>('CompositionEventMode');
 
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
 @Directive({
   selector:
       'nimble-select',
   host: {
     '(input)': '$any(this)._handleInput($event.target.value)',
     '(blur)': 'onTouched()',
     '(compositionstart)': '$any(this)._compositionStart()',
     '(compositionend)': '$any(this)._compositionEnd($event.target.value)'
   },
   providers: [DEFAULT_VALUE_ACCESSOR]
 })
 export class NimbleControlValueAccessor extends BaseControlValueAccessor implements ControlValueAccessor {
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