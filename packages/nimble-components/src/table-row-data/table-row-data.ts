import { observable } from '@microsoft/fast-element';
import type { PerspectiveViewerNimbleTable } from '../perspective-viewer-nimble-table';
import type { CellData } from '../table-cell';

/**
 * adsf
 */
export class TableRowData {
    @observable
    public data?: CellData[];

    public parent?: PerspectiveViewerNimbleTable;
}