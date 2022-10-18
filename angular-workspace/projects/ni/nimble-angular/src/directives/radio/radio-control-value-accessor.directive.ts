/* eslint-disable @angular-eslint/no-host-metadata-property */
/* eslint-disable @angular-eslint/directive-class-suffix */
/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/member-ordering */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/explicit-member-accessibility */
/* eslint-disable max-classes-per-file */

/**
 * The contents of this file were taken with minimal modification from Angular's source:
 * https://github.com/angular/angular/blob/0d65e1de2c8ea76a5e48df227638cdeabac82c42/packages/forms/src/directives/ng_control.ts
 * https://github.com/angular/angular/blob/0d65e1de2c8ea76a5e48df227638cdeabac82c42/packages/forms/src/directives/control_value_accessor.ts
 * https://github.com/angular/angular/blob/0d65e1de2c8ea76a5e48df227638cdeabac82c42/packages/forms/src/directives/radio_control_value_accessor.ts
 * See https://github.com/ni/nimble/issues/782 for motivation/context.
 *
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import { Directive, ElementRef, forwardRef, Injectable, Injector, Input, NgModule, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { AbstractControlDirective, ControlContainer, ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

/**
 * Angular's NgControl
 */
abstract class NgControl extends AbstractControlDirective {
    /**
     * @description
     * The parent form for the control.
     *
     * @internal
     */
    _parent: ControlContainer | null = null;

    /**
     * @description
     * The name for the control
     */
    name: string | number | null = null;

    /**
     * @description
     * The value accessor for the control
     */
    valueAccessor: ControlValueAccessor | null = null;

    /**
     * @description
     * The callback method to update the model from the view when requested
     *
     * @param newValue The new value for the view
     */
    abstract viewToModelUpdate(newValue: any): void;
}

/**
 * Base class for all ControlValueAccessor classes defined in Forms package.
 * Contains common logic and utility functions.
 *
 * Note: this is an *internal-only* class and should not be extended or used directly in
 * applications code.
 */
@Directive()
class BaseControlValueAccessor {
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

    constructor(private readonly _renderer: Renderer2, private readonly _elementRef: ElementRef) {}

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

/**
  * Internal-only NgModule that works as a host for the `RadioControlRegistry` tree-shakable
  * provider. Note: the `InternalFormsSharedModule` can not be used here directly, since it's
  * declared *after* the `RadioControlRegistry` class and the `providedIn` doesn't support
  * `forwardRef` logic.
  */
@NgModule()
export class RadioControlRegistryModule {
}

/**
 * Angular's RadioControlRegistry
 */
@Injectable({ providedIn: RadioControlRegistryModule })
export class RadioControlRegistry {
    private readonly _accessors: any[] = [];

    /**
    * @description
    * Adds a control to the internal registry. For internal use only.
    */
    add(control: NgControl, accessor: RadioControlValueAccessor) {
        this._accessors.push([control, accessor]);
    }

    /**
    * @description
    * Removes a control from the internal registry. For internal use only.
    */
    remove(accessor: RadioControlValueAccessor) {
        for (let i = this._accessors.length - 1; i >= 0; --i) {
            if (this._accessors[i][1] === accessor) {
                this._accessors.splice(i, 1);
                return;
            }
        }
    }

    /**
    * @description
    * Selects a radio button. For internal use only.
    */
    select(accessor: RadioControlValueAccessor) {
        this._accessors.forEach(c => {
            if (this._isSameGroup(c, accessor) && c[1] !== accessor) {
                c[1].fireUncheck(accessor.value);
            }
        });
    }

    private _isSameGroup(
        controlPair: [NgControl, RadioControlValueAccessor],
        accessor: RadioControlValueAccessor
    ): boolean {
        if (!controlPair[0].control) return false;
        return controlPair[0]._parent === accessor._control._parent
         && controlPair[1].name === accessor.name;
    }
}

/**
 * Angular's RadioControlValueAccessor
 */
@Directive({
    selector:
        'input[type=radio][formControlName],input[type=radio][formControl],input[type=radio][ngModel]',
    host: { '(change)': 'onChange()', '(blur)': 'onTouched()' },
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => RadioControlValueAccessor),
        multi: true
    }]
})
export class RadioControlValueAccessor extends BaseControlValueAccessor implements
      ControlValueAccessor, OnDestroy, OnInit {
    /** @internal */
    // TODO(issue/24571): remove '!'.
    _state!: boolean;
    /** @internal */
    // TODO(issue/24571): remove '!'.
    _control!: NgControl;
    /** @internal */
    // TODO(issue/24571): remove '!'.
    _fn!: Function;

    /**
     * The registered callback function called when a change event occurs on the input element.
     * Note: we declare `onChange` here (also used as host listener) as a function with no arguments
     * to override the `onChange` function (which expects 1 argument) in the parent
     * `BaseControlValueAccessor` class.
     * @nodoc
     */
    override onChange = () => {};

    /**
     * @description
     * Tracks the name of the radio input element.
     */
    // TODO(issue/24571): remove '!'.
    @Input() name!: string;

    /**
     * @description
     * Tracks the name of the `FormControl` bound to the directive. The name corresponds
     * to a key in the parent `FormGroup` or `FormArray`.
     */
    // TODO(issue/24571): remove '!'.
    @Input() formControlName!: string;

    /**
     * @description
     * Tracks the value of the radio input element
     */
    @Input() value: any;

    constructor(
        renderer: Renderer2, elementRef: ElementRef, private readonly _registry: RadioControlRegistry,
        private readonly _injector: Injector
    ) {
        super(renderer, elementRef);
    }

    /** @nodoc */
    ngOnInit(): void {
        this._control = this._injector.get(NgControl);
        this._checkName();
        this._registry.add(this._control, this);
    }

    /** @nodoc */
    ngOnDestroy(): void {
        this._registry.remove(this);
    }

    /**
     * Sets the "checked" property value on the radio input element.
     * @nodoc
     */
    writeValue(value: any): void {
        this._state = value === this.value;
        this.setProperty('checked', this._state);
    }

    /**
     * Registers a function called when the control value changes.
     * @nodoc
     */
    override registerOnChange(fn: (_: any) => {}): void {
        this._fn = fn;
        this.onChange = () => {
            fn(this.value);
            this._registry.select(this);
        };
    }

    /**
     * Sets the "value" on the radio input element and unchecks it.
     *
     * @param value
     */
    fireUncheck(value: any): void {
        this.writeValue(value);
    }

    private _checkName(): void {
        /* Commenting out because ngDevMode is undefined
        if (this.name && this.formControlName && this.name !== this.formControlName
          && (typeof ngDevMode === 'undefined' || ngDevMode)) {
            throwNameError();
        }
        */
        if (!this.name && this.formControlName) this.name = this.formControlName;
    }
}