import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { NumberField } from '@ni/nimble-components/dist/esm/number-field';

@Component({
    selector: 'nimble-angular-number-field',
    templateUrl: './nimble-number-field.component.html',
    styleUrls: ['./nimble-number-field.component.scss']
})
export class NimbleNumberFieldComponent {
    @ViewChild('nimbleNumberField', { static: true }) public nimbleNumberField: ElementRef<NumberField>;
    @Output() public valueChange = new EventEmitter<number>();

    public get value(): number {
        return parseFloat(this.nimbleNumberField.nativeElement.value);
    }

    @Input() public set value(value: number) {
        this.nimbleNumberField.nativeElement.value = value.toString();
        this.valueChange.emit(value);
    }

    public get min(): number {
        return this.nimbleNumberField.nativeElement.min;
    }

    @Input() public set min(value: number) {
        this.nimbleNumberField.nativeElement.min = value;
    }

    public get max(): number {
        return this.nimbleNumberField.nativeElement.max;
    }

    @Input() public set max(value: number) {
        this.nimbleNumberField.nativeElement.max = value;
    }

    public get step(): number {
        return this.nimbleNumberField.nativeElement.step;
    }

    @Input() public set step(value: number) {
        this.nimbleNumberField.nativeElement.step = value;
    }

    public valueChanged(): void {
        this.valueChange.emit(parseFloat(this.nimbleNumberField.nativeElement.value));
    }
}
