import { html } from '@microsoft/fast-element';
import type { TableColumnTextCellData, TableColumnTextColumnConfig } from '.';
import type { TableCellState } from '../../table/types';

export const cellTemplate = html<
TableCellState<TableColumnTextCellData, TableColumnTextColumnConfig>
>`
    <span
        class="${x => (x.data.value !== null && x.data.value !== undefined
        ? 'text-value'
        : 'placeholder')}"
    >
        ${x => (x.data.value !== null && x.data.value !== undefined
        ? x.data.value
        : x.columnConfig.placeholder)}
    </span>
`;
