/**
 * The code in this file is almost entirely copied from the BaseControlValueAccessor and
 * the DefaultValueAccessor in the Angular source.
 *
 * https://github.com/angular/angular/blob/478131c519cd3e12fbede458d5c6ecdc1ca0c9ce/packages/forms/src/directives/default_value_accessor.ts
 *
 * At this time there doesn't seem to be a good way to extend a directive with another
 * directive, or to add a directive to the host element of another directive. So the next
 * best solution is to copy the code to our repo and use our own selectors in the directive
 * decorator.
 *
 * See this issue: https://github.com/angular/angular/issues/8785#issuecomment-726755076
 */

import { Directive, ElementRef, forwardRef, Inject, Optional, Renderer2 } from '@angular/core';
import { ɵgetDOM as getDOM } from '@angular/common';
import { COMPOSITION_BUFFER_MODE, ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

// Disable some eslint rules about "any" types - since this code is primarily copied
/* eslint-disable @typescript-eslint/no-unsafe-assignment,
                  @typescript-eslint/no-explicit-any,
                  @typescript-eslint/explicit-module-boundary-types */

/**
 * We must check whether the agent is Android because composition events
 * behave differently between iOS and Android.
 */
function _isAndroid(): boolean {
    const userAgent = getDOM() ? getDOM().getUserAgent() : '';
    return /android (\d+)/.test(userAgent.toLowerCase());
}

@Directive({
    selector: 'nimble-select',
    host: {
        '(input)': '$any(this).handleInput($event.target.value)',
        '(blur)': 'onTouched()',
        '(compositionstart)': '$any(this).compositionStart()',
        '(compositionend)': '$any(this).compositionEnd($event.target.value)'
    },
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => NimbleControlValueAccessorDirective),
            multi: true
        }
    ]
})
export class NimbleControlValueAccessorDirective implements ControlValueAccessor {
    private composing = false;

    public constructor(
        private readonly renderer: Renderer2, private readonly elementRef: ElementRef,
        @Optional() @Inject(COMPOSITION_BUFFER_MODE) private readonly compositionMode: boolean
    ) {
        if (this.compositionMode == null) {
            this.compositionMode = !_isAndroid();
        }
    }

    public registerOnTouched(fn: () => void): void {
        this.onTouched = fn;
    }

    public registerOnChange(fn: (_: any) => void): void {
        this.onChange = fn;
    }

    public setDisabledState(isDisabled: boolean): void {
        this.setProperty('disabled', isDisabled);
    }

    public writeValue(value: any): void {
        const normalizedValue = value == null ? '' : value;
        this.setProperty('value', normalizedValue);
    }

    private setProperty(key: string, value: unknown): void {
        this.renderer.setProperty(this.elementRef.nativeElement, key, value);
    }

    private onChange = (_: any): void => {};
    private onTouched = (): void => {};

    private handleInput(value: any): void {
        if (!this.compositionMode || (this.compositionMode && !this.composing)) {
            this.onChange(value);
        }
    }

    private compositionStart(): void {
        this.composing = true;
    }

    private compositionEnd(value: any): void {
        this.composing = false;
        if (this.compositionMode) {
            this.onChange(value);
        }
    }
}
