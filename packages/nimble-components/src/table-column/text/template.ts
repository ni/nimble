import { html } from '@microsoft/fast-element';
import type { TableColumnTextCellRecord, TableColumnTextColumnConfig } from './table-column-text-base';
import type { TableCellState } from '../../table/types';

export const cellTemplate = html<
TableCellState<TableColumnTextCellRecord, TableColumnTextColumnConfig>
>`
    <span
        class="${x => (typeof x.cellRecord.value === 'string' ? '' : 'placeholder')}"
    >
        ${x => (typeof x.cellRecord.value === 'string'
        ? x.cellRecord.value
        : x.columnConfig.placeholder)}
    </span>
`;
