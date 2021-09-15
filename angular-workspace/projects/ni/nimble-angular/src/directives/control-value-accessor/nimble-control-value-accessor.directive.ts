/**
 * Copied from Angular source: https://github.com/angular/angular/blob/master/packages/forms/src/directives/control_value_accessor.ts
 *
 * Modified to add directive selector to satisfy compiler.
 */

/* eslint-disable */

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import { Directive, ElementRef, Renderer2 } from "@angular/core";

/**
 * Base class for all ControlValueAccessor classes defined in Forms package.
 * Contains common logic and utility functions.
 *
 * Note: this is an *internal-only* class and should not be extended or used directly in
 * applications code.
 */
 @Directive({
  selector: 'fake-selector'
})
 export class NimbleBaseControlValueAccessor {
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