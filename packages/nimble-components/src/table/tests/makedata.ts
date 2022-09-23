// eslint-disable-next-line import/no-extraneous-dependencies
import faker from '@faker-js/faker';
import { html } from '@microsoft/fast-element';
import type { TableColumn } from '..';
import type { TableCell } from '../../table-cell';

export interface Person {
    id: number;
    firstName: string;
    lastName: string;
    age: number;
    visits: number;
    progress: number;
    status: 'relationship' | 'complicated' | 'single';
    createdAt: Date;
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
        id: index + 1,
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
    };
};

export function makeData(...lens: number[]): Person[] {
    const makeDataLevel = (depth = 0): Person[] => {
        const len = lens[depth]!;
        return range(len).map((d): Person => {
            return {
                ...newPerson(d),
            };
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
        <nimble-select>
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