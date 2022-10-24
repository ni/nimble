import type { Meta, StoryObj } from '@storybook/html';
import { withXD } from 'storybook-addon-xd-designs';
import '../../all-components';
import { html, ref, repeat } from '@microsoft/fast-element';
import { createUserSelectedThemeStory } from '../../utilities/tests/storybook';
import { getColumns, makeData, Person } from './makedata';
import type { Table, TableColumn } from '../index';

interface TableArgs {
    data: unknown[];
    columns: TableColumn[];
    tableRef: Table;
    startPolling: (tableRef: Table) => void;
    addRow: (tableRef: Table) => void;
    getRowChildren: (tableRef: Table, event: CustomEvent) => void;
    showAlert: (message: string) => void;
}

const expandedRows: Person[] = [];

const metadata: Meta<TableArgs> = {
    title: 'Table',
    parameters: {
        actions: {
            handles: ['row-expand', 'row-collapse']
        }
    },
    // prettier-ignore
    render: createUserSelectedThemeStory(html`
        <nimble-table style="max-height: 500px"
            ${ref('tableRef')}
            :data="${x => x.data}"
            @row-expand="${(x, c) => x.getRowChildren(x.tableRef, c.event as CustomEvent)}"
        >
            <nimble-menu slot="actionMenu" @open-change="${x => x.showAlert('open change')}">
                <nimble-menu-item @change="${x => x.showAlert('item1')}">Item 1</nimble-menu-item>
                <nimble-menu-item @change="${x => x.showAlert('item2')}">Item 2</nimble-menu-item>
            </nimble-menu>

            ${repeat(_ => expandedRows, html<Person>`
                <div slot="${x => `expandedRow-${x.id}`}" style="width: 100%; height: ${x => (x.age || 0) * 5 + 20}px; background: lightgray;">
                    ${x => x.createdAt}
                    <nimble-text-field></nimble-text-field>
                </div>
            `)}
        </nimble-table>
        <br>
        <nimble-button appearance="block" @click="${x => x.startPolling(x.tableRef)}">Start polling (3 seconds)</nimble-button>
        <nimble-button appearance="block" @click="${x => x.addRow(x.tableRef)}">Add row</nimble-button>
    `),
    args: {
        data: makeData(5000),
        columns: getColumns(),
        startPolling: (tableRef: Table) => {
            // tableRef.data = makeData(2000, 9, 3);
            setInterval(() => {
                const existingData = tableRef.data as Person[];
                for (const p of existingData) {
                    p.age += 1;
                }

                tableRef.data = JSON.parse(JSON.stringify(existingData)) as Person[];
            }, 3000);
        },
        addRow: (tableRef: Table) => {
            const existingData = tableRef.data as Person[];
            const newPerson: Person = {
                age: 0.5,
                children: [],
                createdAt: new Date(),
                firstName: 'John',
                lastName: 'Doe',
                id: '123',
                progress: 0,
                status: 'complicated',
                visits: 0
            };
            existingData.push(newPerson);
            tableRef.data = JSON.parse(JSON.stringify(existingData)) as Person[];
        },
        getRowChildren: (tableRef: Table, event: CustomEvent) => {
            const rowId = (event.detail as { id: string }).id;
            const person = (tableRef.data as Person[]).find(p => p.id === rowId);
            if (person && !expandedRows.find(x => x.id === rowId)) {
                expandedRows.push(person);
            }
            // const rowId = (event.detail as { id: string }).id;
            // const person = (tableRef.data as Person[]).find(p => p.id === rowId);
            // if (!person || person.children.length) {
            //     return;
            // }

            // person.children = makeData(3);
            // setTimeout(() => {
            //     tableRef.data = JSON.parse(JSON.stringify(tableRef.data)) as Person[];
            // }, 2000);
        },
        showAlert: (message: string) => {
            // eslint-disable-next-line no-alert
            alert(message);
        }
    }
};

export default metadata;

export const tableStory: StoryObj<TableArgs> = {
    name: 'Table'
};
