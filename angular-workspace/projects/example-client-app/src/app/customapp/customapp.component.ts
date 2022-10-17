/* eslint-disable no-alert */
import faker from '@faker-js/faker';
// import { html } from '@microsoft/fast-element';
import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { DrawerLocation, MenuItem, NimbleDialogDirective, NimbleDrawerDirective, NimbleTableDirective, OptionNotFound, OPTION_NOT_FOUND, UserDismissed } from '@ni/nimble-angular';

let count = 0;

interface Person {
    id: string;
    firstName: string;
    lastName: string;
    age: number;
    visits: number;
    progress: number;
    status: 'relationship' | 'complicated' | 'single';
    createdAt: Date;
    children: Person[];
}

const range = (len: number): number[] => {
    const arr = [];
    for (let i = 0; i < len; i++) {
        arr.push(i);
    }
    return arr;
};

const newPerson = (index: number): Person => {
    return {
        id: `person-${index + 1}-id`,
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        age: faker.datatype.number(40),
        visits: faker.datatype.number(1000),
        progress: faker.datatype.number(100),
        createdAt: faker.datatype.datetime({ max: new Date().getTime() }),
        status: faker.helpers.shuffle<Person['status']>([
            'relationship',
            'complicated',
            'single',
        ])[0]!,
        children: []
    };
};

// function getColumns(): unknown[] {
//     return [{
//         columnDataKey: 'firstName',
//         title: 'First Name',
//         cellTemplate: html`
//             <nimble-text-field appearance="frameless" readonly="true" value=${x => x.cellData}>
//             </nimble-text-field>
//         `,
//         showMenu: true
//     }, {
//         columnDataKey: 'lastName',
//         title: 'Last Name',
//         cellTemplate: html`
//         <nimble-text-field appearance="frameless" readonly="true" value=${x => x.cellData}>
//         </nimble-text-field>
//         `,
//     }, {
//         columnDataKey: 'age',
//         title: 'Age',
//         cellTemplate: html`
//         <nimble-text-field appearance="frameless" readonly="true" value=${x => x.cellData}>
//         </nimble-text-field>
//     `,
//     }, {
//         columnDataKey: 'visits',
//         title: 'Visits',
//         cellTemplate: html`
//         <nimble-text-field appearance="frameless" readonly="true" value=${x => x.cellData}>
//         </nimble-text-field>
//     `,
//     }, {
//         columnDataKey: 'status',
//         title: 'Status',
//         cellTemplate: html`
//         <nimble-select value=${x => x.cellData}>
//             <nimble-list-option value="relationship">In Relationship</nimble-list-option>
//             <nimble-list-option value="single">Single</nimble-list-option>
//             <nimble-list-option value="complicated">Complicated</nimble-list-option>
//         </nimble-select>
//     `,
//     }, {
//         columnDataKey: 'progress',
//         title: 'Progress',
//         cellTemplate: html`
//         <nimble-number-field value=${x => x.cellData}>
//         </nimble-number-field>
//         `,
//     }];
// }

export function makeData(...lens: number[]): Person[] {
    const makeDataLevel = (depth = 0): Person[] => {
        const len = lens[depth]!;
        return range(len).map((): Person => {
            const person = {
                // eslint-disable-next-line no-plusplus
                ...newPerson(count++),
                // children: lens[depth + 1] ? makeDataLevel(depth + 1) : []
            };
            if (person.age < 5) {
                person.children = makeData(1);
            }
            return person;
        });
    };

    return makeDataLevel();
}

interface ComboboxItem {
    first: string;
    last: string;
}

@Component({
    selector: 'example-customapp',
    templateUrl: './customapp.component.html',
    styleUrls: ['./customapp.component.scss']
})
export class CustomAppComponent implements AfterViewInit {
    public dialogCloseReason: string;
    public drawerCloseReason: string;
    public drawerLocation: DrawerLocation = DrawerLocation.right;
    public isDrawerPinned = false;
    public drawerLocations = DrawerLocation;
    public comboboxItems: ComboboxItem[] = [
        { first: 'foo', last: 'bar' },
        { first: 'Bubba', last: 'Hotep' },
        { first: 'Mister', last: 'Smithers' }
    ];

    public comboboxSelectedOption?: ComboboxItem;
    public comboboxSelectedLastName = this.comboboxSelectedOption?.last;
    public selectedRadio = 'mango';

    @ViewChild('dialog', { read: NimbleDialogDirective }) private readonly dialog: NimbleDialogDirective<string>;
    @ViewChild('drawer', { read: NimbleDrawerDirective }) private readonly drawer: NimbleDrawerDirective<string>;
    @ViewChild('table', { read: NimbleTableDirective }) private readonly table: NimbleTableDirective;

    public ngAfterViewInit(): void {
        this.table.data = makeData(2000);
        // this.table.columns = getColumns();
    }

    public onMenuButtonMenuChange(event: Event): void {
        const menuItemText = (event.target as MenuItem).innerText;
        alert(`${menuItemText} selected`);
    }

    public onComboboxChange(value: ComboboxItem | OptionNotFound): void {
        if (value !== OPTION_NOT_FOUND) {
            this.comboboxSelectedLastName = value.last;
        } else {
            this.comboboxSelectedLastName = 'not found';
        }
    }

    public async openDialog(): Promise<void> {
        const closeReason = await this.dialog.show();
        this.dialogCloseReason = (closeReason === UserDismissed) ? 'escape pressed' : closeReason;
    }

    public closeDialog(reason: string): void {
        this.dialog.close(reason);
    }

    public async openDrawer(): Promise<void> {
        const closeReason = await this.drawer.show();
        this.drawerCloseReason = (closeReason === UserDismissed) ? 'escape pressed' : closeReason;
    }

    public closeDrawer(reason: string): void {
        this.drawer.close(reason);
    }

    public onTabToolbarButtonClick(): void {
        alert('Tab toolbar button clicked');
    }
}
