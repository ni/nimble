import { observable } from '@microsoft/fast-element';
import type { TableRowData } from './table-row-data';

/**
 * adsf
 */
export class VirtualTableRowData {
    @observable
    public start = 0;

    @observable
    public size = 32;

    @observable
    public rowData?: TableRowData;
}