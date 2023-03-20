import { html } from '@microsoft/fast-element';
import type { TableColumnTextCellRecord, TableColumnTextColumnConfig } from '.';
import type { TableCellState } from '../base/types';
import { removeTitle, setTitleWhenOverflow } from './template-helpers';

const getCellContent = (
    cellState: TableCellState<
    TableColumnTextCellRecord,
    TableColumnTextColumnConfig
    >
): string => {
    return typeof cellState.cellRecord.value === 'string'
        ? cellState.cellRecord.value
        : cellState.columnConfig.placeholder;
};
export const cellTemplate = html<
TableCellState<TableColumnTextCellRecord, TableColumnTextColumnConfig>
>`
    <span
        class="${x => (typeof x.cellRecord.value === 'string' ? '' : 'placeholder')}"
        @mouseover="${(x, c) => setTitleWhenOverflow(
        c.event.target as HTMLElement,
        getCellContent(x)
    )}"
        @mouseout="${(_x, c) => removeTitle(c.event.target as HTMLElement)}"
    >
        ${x => getCellContent(x)}
    </span>
`;
