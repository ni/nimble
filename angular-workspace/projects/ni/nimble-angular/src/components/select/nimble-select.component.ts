import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { Select } from '@microsoft/fast-foundation';

@Component({
    selector: 'nimble-angular-select',
    templateUrl: './nimble-select.component.html',
    styleUrls: ['./nimble-select.component.css']
})
export class NimbleSelectComponent {
    @ViewChild('nimbleSelect', { static: true }) public nimbleSelect: ElementRef<Select>;
    @Output() public valueChange = new EventEmitter<string>();

    public get value(): string {
        return this.nimbleSelect.nativeElement.value;
    }

    @Input() public set value(value: string) {
        this.nimbleSelect.nativeElement.value = value;
        this.valueChange.emit(value);
    }

    @Input() public disabled: boolean;

    public valueChanged(): void {
        this.valueChange.emit(this.nimbleSelect.nativeElement.value);
    }
}
