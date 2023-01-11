import { html } from '@microsoft/fast-element';
import type { TableColumnTextCellRecord, TableColumnTextColumnConfig } from '.';
import type { TableCellState } from '../../table/types';

export const cellTemplate = html<
TableCellState<TableColumnTextCellRecord, TableColumnTextColumnConfig>
>`
    <span
        class="${x => (typeof x.data.value === 'string' ? 'text-value' : 'placeholder')}"
    >
        ${x => (typeof x.data.value === 'string'
        ? x.data.value
        : x.columnConfig.placeholder)}
    </span>
`;
