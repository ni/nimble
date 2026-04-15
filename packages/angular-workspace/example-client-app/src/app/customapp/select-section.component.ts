import { Component, ViewChild } from '@angular/core';
import { NimbleSelectDirective, type SelectFilterInputEventDetail } from '@ni/nimble-angular';

interface ComboboxItem {
    first: string;
    last: string;
}

@Component({
    selector: 'example-select-section',
    template: `
        <example-sub-container label="Select">
            <nimble-select filter-mode="standard" appearance="underline">
                Underline Select
                <nimble-list-option hidden selected disabled>Select an option</nimble-list-option>
                <nimble-list-option-group label="Group 1">
                    <nimble-list-option>Option 1</nimble-list-option>
                    <nimble-list-option>Option 2</nimble-list-option>
                </nimble-list-option-group>
                <nimble-list-option-group label="Group 2">
                    <nimble-list-option>Option 3</nimble-list-option>
                    <nimble-list-option>Option 4</nimble-list-option>
                </nimble-list-option-group>
            </nimble-select>
            <nimble-select appearance="outline">
                Outline Select
                <nimble-list-option hidden selected disabled>Select an option</nimble-list-option>
                <nimble-list-option-group label="Group 1">
                    <nimble-list-option>Option 1</nimble-list-option>
                    <nimble-list-option>Option 2</nimble-list-option>
                </nimble-list-option-group>
                <nimble-list-option-group label="Group 2">
                    <nimble-list-option>Option 3</nimble-list-option>
                    <nimble-list-option>Option 4</nimble-list-option>
                </nimble-list-option-group>
            </nimble-select>
            <nimble-select appearance="block">
                Block Select
                <nimble-list-option hidden selected disabled>Select an option</nimble-list-option>
                <nimble-list-option-group label="Group 1">
                    <nimble-list-option>Option 1</nimble-list-option>
                    <nimble-list-option>Option 2</nimble-list-option>
                </nimble-list-option-group>
                <nimble-list-option-group label="Group 2">
                    <nimble-list-option>Option 3</nimble-list-option>
                    <nimble-list-option>Option 4</nimble-list-option>
                </nimble-list-option-group>
            </nimble-select>
            <example-sub-container label="Select with dynamic options">
                <nimble-select #dynamicSelect appearance="underline" filter-mode="manual" [(ngModel)]="dynamicSelectValue" (filter-input)="onDynamicSelectFilterInput($event)" [compareWith]="dynamicSelectCompareWith">
                    <nimble-list-option hidden selected disabled [ngValue]="dynamicSelectPlaceholderValue">Select an option</nimble-list-option>
                    <nimble-list-option *ngFor="let item of dynamicSelectItems" [ngValue]="item" [hidden]="shouldHideItem(item)">{{ item.first }} {{ item.last }}</nimble-list-option>
                </nimble-select>
            </example-sub-container>
        </example-sub-container>
    `,
    standalone: false
})
export class SelectSectionComponent {
    public dynamicSelectItems: ComboboxItem[] = [];
    public dynamicSelectPlaceholderValue = null;
    public dynamicSelectValue: ComboboxItem | null = null;

    private readonly availableSelectItems: ComboboxItem[] = [
        { first: 'Homer', last: 'Simpson' },
        { first: 'Marge', last: 'Simpson' },
        { first: 'Bart', last: 'Simpson' },
        { first: 'Lisa', last: 'Simpson' },
        { first: 'Maggie', last: 'Simpson' },
        { first: 'Mona', last: 'Simpson' },
        { first: 'Jacqueline', last: 'Bouvier' },
        { first: 'Selma', last: 'Bouvier' },
        { first: 'Patty', last: 'Bouvier' },
        { first: 'Abe', last: 'Simpson' },
        { first: 'Ned', last: 'Flanders' },
        { first: 'Maude', last: 'Flanders' },
        { first: 'Rod', last: 'Flanders' },
        { first: 'Todd', last: 'Flanders' }
    ];

    private readonly defaultDynamicSelectItems = this.availableSelectItems.slice(0, 5);
    private dynamicSelectFilterTimeout?: number;
    private hideSelectedItem = false;

    @ViewChild('dynamicSelect', { read: NimbleSelectDirective }) private readonly dynamicSelect: NimbleSelectDirective;

    public constructor() {
        this.dynamicSelectItems = this.defaultDynamicSelectItems;
    }

    public onDynamicSelectFilterInput(e: Event): void {
        const event = e as CustomEvent<SelectFilterInputEventDetail>;
        const filter = event.detail.filterText;
        if (filter.length > 0) {
            window.clearTimeout(this.dynamicSelectFilterTimeout);
            this.dynamicSelect.loadingVisible = true;
            this.dynamicSelectFilterTimeout = window.setTimeout(() => {
                const filteredItems = this.availableSelectItems.filter(item => item.first.concat(item.last).toLowerCase().includes(filter.toLowerCase()));
                this.setDynamicSelectItems(filteredItems);
                this.hideSelectedItem = this.dynamicSelectValue ? !filteredItems.includes(this.dynamicSelectValue) : false;
                this.dynamicSelect.loadingVisible = false;
            }, 2000);
        } else {
            this.hideSelectedItem = false;
            window.clearTimeout(this.dynamicSelectFilterTimeout);
            this.setDynamicSelectItems(this.defaultDynamicSelectItems);
            this.dynamicSelect.loadingVisible = false;
        }
    }

    public dynamicSelectCompareWith(o1: ComboboxItem | null | undefined, o2: ComboboxItem | null | undefined): boolean {
        if (typeof o1 === 'object' && typeof o2 === 'object' && o1 !== null && o2 !== null) {
            return o1.first === o2.first && o1.last === o2.last;
        }
        return o1 === o2;
    }

    public shouldHideItem(value: ComboboxItem): boolean {
        return this.hideSelectedItem && value === this.dynamicSelectValue;
    }

    private setDynamicSelectItems(dynamicSelectItems: ComboboxItem[]): void {
        if (this.dynamicSelectValue && !dynamicSelectItems.includes(this.dynamicSelectValue)) {
            this.dynamicSelectItems = [...dynamicSelectItems, this.dynamicSelectValue];
        } else {
            this.dynamicSelectItems = dynamicSelectItems;
        }
    }
}
