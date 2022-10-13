// eslint-disable-next-line import/no-extraneous-dependencies
import faker from '@faker-js/faker';
import { html } from '@microsoft/fast-element';
import type { TableColumn } from '..';
import type { TableCell } from '../../table-cell';

let count = 0;

export interface Person {
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

export function getColumns(): TableColumn[] {
    return [{
        columnDataKey: 'firstName',
        title: 'First Name',
        cellTemplate: html<TableCell>`
            <nimble-text-field appearance="frameless" readonly="true" value=${x => x.cellData}>
            </nimble-text-field>
        `,
    },
    {
        columnDataKey: 'lastName',
        title: 'Last Name',
        cellTemplate: html<TableCell, TableCell>`
        <nimble-text-field appearance="frameless" readonly="true" value=${x => x.cellData}>
        </nimble-text-field>
        `,
    }, {
        columnDataKey: 'nimble-action-menu',
        title: '',
        // cellTemplate: html<TableCell>`
        //     <nimble-text-field appearance="frameless" readonly="true" value="hello">
        //     </nimble-text-field>
        // `,
    },
    {
        columnDataKey: 'age',
        title: 'Age',
        cellTemplate: html<TableCell, TableCell>`
        <nimble-text-field appearance="frameless" readonly="true" value=${x => x.cellData}>
        </nimble-text-field>
    `,
    },
    {
        columnDataKey: 'visits',
        title: 'Visits',
        cellTemplate: html<TableCell, TableCell>`
        <nimble-text-field appearance="frameless" readonly="true" value=${x => x.cellData}>
        </nimble-text-field>
    `,
    },
    {
        columnDataKey: 'status',
        title: 'Status',
        cellTemplate: html<TableCell, TableCell>`
        <nimble-select value=${x => x.cellData}>
            <nimble-list-option value="relationship">In Relationship</nimble-list-option>
            <nimble-list-option value="single">Single</nimble-list-option>
            <nimble-list-option value="complicated">Complicated</nimble-list-option>
        </nimble-select>
    `,
    },
    {
        columnDataKey: 'progress',
        title: 'Progress',
        cellTemplate: html<TableCell, TableCell>`
        <nimble-number-field value=${x => x.cellData}>
        </nimble-number-field>
        `,
    }
    ];
}