import '@babel/polyfill';
import '@ni/nimble-components/dist/esm/theme-provider';
import '@ni/nimble-components/dist/esm/button';
import '@ni/nimble-components/dist/esm/number-field';
import { defineCustomElements } from '@revolist/revogrid/loader';
import { Components } from '@revolist/revogrid';
import * as RevoInterfaces from '@revolist/revogrid/dist/types/interfaces';
import './styles.css';
defineCustomElements();

const items = [];
const hideShowRowIds = {};
let rowsHidden = false;
for (let i = 2; i < 50000; i++) {
    hideShowRowIds[i] = true;
}
class Main {
    static initialize() {
        Main.initData();

        const grid = document.querySelector('revo-grid') as Components.RevoGrid;
        const columns: RevoInterfaces.RevoGrid.ColumnDataSchema[] = [{
                prop: 'col1',
                name: 'First column'
            },
            {
                prop: 'col2',
                name: 'Second column',
                readOnly: true, // Prevent double-click showing a built-in cell editor textbox
                cellTemplate: (createElement, props) => {
                    // console.log(props);
                    return createElement('nimble-number-field', {
                        value: props.model.id
                    });
                }
            },
        ];

        grid.columns = columns;
    }

    static initData() {
        for (let i = 0; i < 100000; i++) {
            items.push({
                id: i,
                col1: 'Row ' + i.toString(),
                col2: i
            });
        }
    }

    static setGridData() {
        const grid = document.querySelector('revo-grid') as Components.RevoGrid;
        grid.source = items;
    }

    static hideShowRows() {
        const grid = document.querySelector('revo-grid') as Components.RevoGrid;
        grid.trimmedRows = rowsHidden ? {} : hideShowRowIds;
        rowsHidden = !rowsHidden;
    }
}

window['Main'] = Main;
window.onload = () => Main.initialize();