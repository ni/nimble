import type { Meta, StoryObj } from '@storybook/html';
import { withXD } from 'storybook-addon-xd-designs';
import '../../all-components';
import { html, ref } from '@microsoft/fast-element';
import { createUserSelectedThemeStory } from '../../utilities/tests/storybook';
import { getColumns, makeData } from './makedata';
import type { Table, TableColumn } from '../index';

interface TableArgs {
    data: unknown[];
    columns: TableColumn[];
    tableRef: Table;
    generateNewData: (tableRef: Table) => void;
    logState: (tableRef: Table) => void;
    getRowChildren: (tableRef: Table, event: CustomEvent) => void;
    showAlert: (message: string) => void;
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
            :columns="${x => x.columns}"
            @row-expand="${(x, c) => x.getRowChildren(x.tableRef, c.event)}"
        >
            <nimble-menu slot="actionMenu" @open-change="${x => x.showAlert('open change')}">
                <nimble-menu-item @change="${x => x.showAlert('item1')}">Item 1</nimble-menu-item>
                <nimble-menu-item @change="${x => x.showAlert('item2')}">Item 2</nimble-menu-item>
            </nimble-menu>
            
            <!-- <nimble-menu-item slot="actionMenuItem" @change="${x => x.showAlert('item1')}">Item 1</nimble-menu-item>
            <nimble-menu-item slot="actionMenuItem" @change="${x => x.showAlert('item2')}">Item 2</nimble-menu-item> -->
        </nimble-table>
        <br>
        <nimble-button appearance="block" @click="${x => x.generateNewData(x.tableRef)}">Update data</nimble-button>
        <nimble-button appearance="block" @click="${x => x.logState(x.tableRef)}">Log state</nimble-button>
        
        <nimble-menu-button content-hidden appearance="outline">
            <nimble-icon-key slot="start"></nimble-icon-key>
            <nimble-menu @open-change="${x => x.showAlert('open change')}" slot="menu">
                <nimble-menu-item @change="${x => x.showAlert('item1')}">Item 1</nimble-menu-item>
                <nimble-menu-item @change="${x => x.showAlert('item2')}">Item 2</nimble-menu-item>
            </nimble-menu>
        </nimble-menu-button>
    `),
    args: {
        data: makeData(2000),
        columns: getColumns(),
        generateNewData: (tableRef: Table) => {
            // tableRef.data = makeData(2000, 9, 3);
            var existingData = tableRef.data;
            for (var p of existingData as Person[]) {
                p.age = p.age + 1;
            }

            tableRef.data = JSON.parse(JSON.stringify(existingData));
        },
        logState: (tableRef: Table) => {
            var state = tableRef.table.getState();
            debugger;
        },
        getRowChildren: (tableRef: Table, event: CustomEvent) => {
            const rowId = event.detail.id;
            const person = tableRef.data.find(p => p.id === rowId);
            if (!person || person.children.length) {
                return;
            }

            person.children = makeData(3);
            setTimeout(() => tableRef.data = JSON.parse(JSON.stringify(tableRef.data)), 2000);
        },
        showAlert: (message: string) => {
            alert(message);
        }
    }
};

export default metadata;

export const tableStory: StoryObj<TableArgs> = {
    name: 'Table'
};
