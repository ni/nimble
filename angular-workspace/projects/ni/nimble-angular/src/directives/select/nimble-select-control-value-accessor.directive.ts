/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import { Directive, forwardRef, Input, isDevMode } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { NimbleBaseControlValueAccessor } from '../control-value-accessor';

// The select control uses "any" types to allow values of any type
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-unsafe-assignment */

@Directive({
    selector:
       'nimble-select:not([multiple])[formControlName],nimble-select:not([multiple])[formControl],nimble-select:not([multiple])[ngModel]',
    host: { '(change)': 'onChange($event.target.value)', '(blur)': 'onTouched()' },
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => NimbleSelectControlValueAccessor),
        multi: true
    }]
})
export class NimbleSelectControlValueAccessor extends NimbleBaseControlValueAccessor implements
     ControlValueAccessor {
    public readonly optionMap: Map<string, any> = new Map<string, any>();
    public value: any;

    private idCounter = 0;
    private _compareWith: (o1: any, o2: any) => boolean = Object.is;

    public static buildValueString(id: string | null, value: any): string {
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        if (id == null) return `${value}`;
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        const valueStringRepresentation = (value && typeof value === 'object') ? 'Object' : `${value}`;
        return `${id}: ${valueStringRepresentation}`.slice(0, 50);
    }

    public static extractId(valueString: string): string {
        return valueString.split(':')[0];
    }

    /**
    * @description
    * Tracks the option comparison algorithm for tracking identities when
    * checking for changes.
    */
    @Input()
    public set compareWith(fn: (o1: any, o2: any) => boolean) {
        if (typeof fn !== 'function' && isDevMode()) {
            throw new Error(`compareWith must be a function, but received ${JSON.stringify(fn)}`);
        }
        this._compareWith = fn;
    }

    /**
    * Sets the "value" property on the input element. The "selectedIndex"
    * property is also set if an ID is provided on the option element.
    * @nodoc
    */
    public writeValue(value: any): void {
        this.value = value;
        const id: string | null = this.getOptionId(value);
        if (id == null) {
            this.setProperty('selectedIndex', -1);
        }
        const valueString = NimbleSelectControlValueAccessor.buildValueString(id, value);
        this.setProperty('value', valueString);
    }

    /**
    * Registers a function called when the control value changes.
    * @nodoc
    */
    public override registerOnChange(fn: (value: any) => any): void {
        this.onChange = (valueString: string): void => {
            this.value = this.getOptionValue(valueString);
            fn(this.value);
        };
    }

    public registerOption(): string {
        const id = this.idCounter;
        this.idCounter += 1;
        return (id).toString();
    }

    private getOptionId(value: any): string | null {
        for (const id of Array.from(this.optionMap.keys())) {
            if (this._compareWith(this.optionMap.get(id), value)) return id;
        }
        return null;
    }

    private getOptionValue(valueString: string): any {
        const id: string = NimbleSelectControlValueAccessor.extractId(valueString);
        return this.optionMap.has(id) ? this.optionMap.get(id) : valueString;
    }
}