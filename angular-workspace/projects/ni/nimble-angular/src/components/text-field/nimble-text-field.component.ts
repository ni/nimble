import { Component, ElementRef, EventEmitter, forwardRef, Input, Output, ViewChild } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { TextField } from '@microsoft/fast-foundation';

@Component({
    selector: 'nimble-angular-text-field',
    templateUrl: './nimble-text-field.component.html',
    styleUrls: ['./nimble-text-field.component.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => NimbleTextFieldComponent),
            multi: true
        }
    ]
})
export class NimbleTextFieldComponent implements ControlValueAccessor {
    @ViewChild('nimbleTextField', { static: true }) public nimbleTextField: ElementRef<TextField>;

    @Input() public placeholder = '';
    @Input() public disabled = false;
    @Input() public type = 'text';

    @Input() public value = '';
    @Output() public valueChange = new EventEmitter();

    public valueChanged(): void {
        this.value = this.nimbleTextField.nativeElement.value;
        this.onChange(this.value);
        this.valueChange.emit(this.value);
    }

    public writeValue(newValue: string): void {
        this.value = newValue;
    }

    // any is the type defined by the Angular docs here: https://angular.io/api/forms/ControlValueAccessor
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public registerOnChange(callback: (_: any) => void): void {
        this.onChange = callback;
    }

    public registerOnTouched(callback: () => void): void {
        this.onTouched = callback;
    }

    public setDisabledState?(isDisabled: boolean): void {
        this.disabled = isDisabled;
    }

    public onTouched = (): void => {};

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    private onChange = (value: string): void => {};
}
