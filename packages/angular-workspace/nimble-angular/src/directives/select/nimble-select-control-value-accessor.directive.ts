import { booleanAttribute, ChangeDetectorRef, Directive, ElementRef, forwardRef, Input, Optional, Renderer2, type OnChanges, type SimpleChanges } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { SelectControlValueAccessor } from '../../thirdparty/directives/select_control_value_accessor';

/**
 * Extension of Angular's SelectControlValueAccessor to target the Nimble select control.
 *
 * @see NimbleSelectOptionDirective
 *
 * Directive decorator based on SelectControlValueAccessor decorator in thirdparty/directives/select_control_value_accessor
 */
@Directive({
    selector:
        'nimble-select:not([multiple])[formControlName],nimble-select:not([multiple])[formControl],nimble-select:not([multiple])[ngModel]',
    // The following host metadata is duplicated from SelectControlValueAccessor
    // eslint-disable-next-line @angular-eslint/no-host-metadata-property, @typescript-eslint/naming-convention
    host: { '(change)': 'onChange($event.target.value)', '(blur)': 'onTouched()' },
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => NimbleSelectControlValueAccessorDirective),
        multi: true
    }]
})
export class NimbleSelectControlValueAccessorDirective extends SelectControlValueAccessor implements OnChanges {
    @Input('readonly-when-disabled') public readonlyWhenDisabled: boolean;

    @Input('readonly') public isReadonly: boolean;

    public constructor(renderer: Renderer2, elementRef: ElementRef, @Optional() private readonly changeDetectorRef: ChangeDetectorRef | null) {
        super(renderer, elementRef);
    }

    public override setDisabledState(isDisabled: boolean): void {
        if (this.readonlyWhenDisabled) {
            this.setProperty('readOnly', isDisabled);
        } else {
            super.setDisabledState(isDisabled);
        }
    }

    public ngOnChanges(changes: SimpleChanges): void {
        if ('isReadonly' in changes && this.readonlyWhenDisabled) {
            this.updateReadonly(changes);
        }
    }

    private updateReadonly(changes: SimpleChanges): void {
        const readonlyValue = changes.isReadonly.currentValue as unknown;
        const isReadonly = readonlyValue !== false && booleanAttribute(readonlyValue);

        setTimeout(() => {
            this.setDisabledState(isReadonly);
            this.changeDetectorRef?.markForCheck();
        }, 0);
    }
}
