import '@babel/polyfill';
import '@ni/nimble-components/dist/esm/theme-provider';
import '@ni/nimble-components/dist/esm/button';
import '@ni/nimble-components/dist/esm/number-field';
import { defineCustomElements } from '@revolist/revogrid/loader';
import { Components } from '@revolist/revogrid';
import * as RevoInterfaces from '@revolist/revogrid/dist/types/interfaces';
import './styles.css';
defineCustomElements();

class Main {
    static initialize() {
        const grid = document.querySelector('revo-grid') as Components.RevoGrid;
        const innerColumns: RevoInterfaces.RevoGrid.ColumnDataSchema[] = [
            { prop: 'a', name: 'A', size: 100 },
            { prop: 'b', name: 'B', size: 100 },
        ];
        const innerData = [];
        for (let i = 0; i < 3; i++) {
            innerData.push({ a: 'A-' + i, b: 'B' + i });
        }
        const columns: RevoInterfaces.RevoGrid.ColumnDataSchema[] = [
          {
              prop: 'name',
              name: 'First'
          },
          {
              prop: 'details',
              name: 'Second',
              readonly: true, // Prevent double-click showing a built-in cell editor textbox
              size: 250,
              cellTemplate: (createElement, props) => {
                return createElement('revo-grid', {
                  columns: innerColumns,
                  source: innerData,
                  style: {
                      width: '240px',
                      height: '118px'
                  }
                });
              }
          }
        ];
        const rows = [];
        for (let i = 0; i < 1000; i++) {
            rows.push({ name: 'Item ' + i, details: '' });
        }
        grid.autoSizeColumn = false;
        grid.columns = columns;
        grid.source = rows;
    }

    static fixColumnWidths() {
        const grid = document.querySelector('revo-grid') as Components.RevoGrid;
        grid.columns = [...grid.columns];
    }
}

window['Main'] = Main;
window.onload = () => Main.initialize();