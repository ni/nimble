import { html } from '@microsoft/fast-element';
import type {
    TableColumnTextCellRecord,
    TableColumnTextColumnConfig
} from '.';
import type { TableCellState } from '../base/types';

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
