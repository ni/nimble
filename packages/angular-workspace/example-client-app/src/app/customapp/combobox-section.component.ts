import { Component } from '@angular/core';
import { type OptionNotFound, OPTION_NOT_FOUND } from '@ni/nimble-angular';

interface ComboboxItem {
    first: string;
    last: string;
}

@Component({
    selector: 'example-combobox-section',
    template: `
        <example-sub-container label="Combobox">
            <nimble-combobox aria-label="Combobox" [(ngModel)]="comboboxSelectedOption" (ngModelChange)="onComboboxChange($event)" appearance="underline" autocomplete="both" placeholder="Select value...">
                Underline Combobox
                <nimble-list-option *ngFor="let item of comboboxItems" [ngValue]="item">{{ item ? item.first : '' }}</nimble-list-option>
            </nimble-combobox>
            <div>
                <span>
                    Last name: {{ comboboxSelectedLastName }}
                </span>
            </div>
            <nimble-combobox aria-label="Combobox" [(ngModel)]="comboboxSelectedOption" (ngModelChange)="onComboboxChange($event)" appearance="outline" autocomplete="both" placeholder="Select value...">
                Outline Combobox
                <nimble-list-option *ngFor="let item of comboboxItems" [ngValue]="item">{{ item ? item.first : '' }}</nimble-list-option>
            </nimble-combobox>
            <nimble-combobox aria-label="Combobox" [(ngModel)]="comboboxSelectedOption" (ngModelChange)="onComboboxChange($event)" appearance="block" autocomplete="both" placeholder="Select value...">
                Block Combobox
                <nimble-list-option *ngFor="let item of comboboxItems" [ngValue]="item">{{ item ? item.first : '' }}</nimble-list-option>
            </nimble-combobox>
        </example-sub-container>
    `,
    standalone: false
})
export class ComboboxSectionComponent {
    public comboboxItems: ComboboxItem[] = [
        { first: 'foo', last: 'bar' },
        { first: 'Bubba', last: 'Hotep' },
        { first: 'Mister', last: 'Smithers' }
    ];

    public comboboxSelectedOption?: ComboboxItem;
    public comboboxSelectedLastName = this.comboboxSelectedOption?.last;

    public onComboboxChange(value: ComboboxItem | OptionNotFound): void {
        if (value !== OPTION_NOT_FOUND) {
            this.comboboxSelectedLastName = value.last;
        } else {
            this.comboboxSelectedLastName = 'not found';
        }
    }
}
