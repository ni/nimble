/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Meta, StoryObj } from '@storybook/html';
import '../../all-components';
import { html, ref, ViewTemplate } from '@microsoft/fast-element';
import { createUserSelectedThemeStory } from '../../utilities/tests/storybook';
import { getColumns, getFriendColumns, makeData, Person } from './makedata';
import type { Table, TableColumn } from '..';

interface TableArgs {
    data: unknown[];
    columns: TableColumn[];
    rowTemplate: (index: number) => ViewTemplate<any, Table<Person>>;
    tableRef: Table;
    generateNewData: (tableRef: Table) => void;
    logState: (tableRef: Table) => void;
    getRowChildren: (tableRef: Table, event: CustomEvent) => void;
    showAlert: (message: string) => void;
}

const rowTemplate = (index: number): ViewTemplate<any, Table<Person>> => html<any, Table<Person>>`
    <nimble-table style="max-height: 500px; height: fit-content;"
        :data="${(_, c) => (c.parent.tableData[index]!.row.original.friends)}"
        :columns="${_ => getFriendColumns()}"
    >
    </nimble-table>
`;

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
            :columns="${x => x.columns}"
            :rowTemplate="${x => x.rowTemplate}"
            @row-expand="${(x, c) => x.getRowChildren(x.tableRef, c.event as CustomEvent)}"
        >
            <nimble-menu slot="actionMenu" @open-change="${x => x.showAlert('open change')}">
                <nimble-menu-item @change="${x => x.showAlert('item1')}">Item 1</nimble-menu-item>
                <nimble-menu-item @change="${x => x.showAlert('item2')}">Item 2</nimble-menu-item>
            </nimble-menu>
        </nimble-table>
        <br>
        <nimble-button appearance="block" @click="${x => x.generateNewData(x.tableRef)}">Update data</nimble-button>
        <nimble-button appearance="block" @click="${x => x.logState(x.tableRef)}">Log state</nimble-button>
    `),
    args: {
        data: makeData(2000),
        columns: getColumns(),
        rowTemplate,
        generateNewData: (tableRef: Table) => {
            // tableRef.data = makeData(2000, 9, 3);
            const existingData = tableRef.data as Person[];
            for (const p of existingData) {
                p.age += 1;
            }

            tableRef.data = JSON.parse(JSON.stringify(existingData)) as Person[];
        },
        logState: (_tableRef: Table) => {
            // var state = tableRef.table.getState();
            // debugger;
        },
        getRowChildren: (tableRef: Table, event: CustomEvent) => {
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
