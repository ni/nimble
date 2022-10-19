import type { Meta, StoryObj } from '@storybook/html';
import { withXD } from 'storybook-addon-xd-designs';
import '../../all-components';
import { html, ref, ViewTemplate } from '@microsoft/fast-element';
import { createUserSelectedThemeStory } from '../../utilities/tests/storybook';
import { getColumns, makeData, Person } from './makedata';
import type { Table, TableColumn, TableRow } from '../index';

interface TableArgs {
    data: unknown[];
    columns: TableColumn[];
    tableRef: Table;
    generateNewData: (tableRef: Table) => void;
    logState: (tableRef: Table) => void;
    getRowChildren: (tableRef: Table, event: CustomEvent) => void;
    showAlert: (message: string) => void;
}

function customRowTemplate(id: string): ViewTemplate {
    const data = getCurrentData();
    const person = data.find(x => x.id === id);
    return html`
        <div style="width: 100%; height: ${_ => rowTemplateHeight(id)}px; background: lightgray;">
            ${_ => person?.createdAt}
            <nimble-text-field></nimble-text-field>
        </div>
    `;
}

function rowTemplateHeight(id: string): number {
    const data = getCurrentData();
    const person = data.find(x => x.id === id);
    return (person?.age || 0) * 5 + 20;
}

function getCurrentData(): Person[] {
    return (document.querySelector('nimble-table')!).data as Person[];
}

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
            :rowTemplate="${_ => customRowTemplate}"
            :rowTemplateHeight="${_ => rowTemplateHeight}"
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
