import { html } from '@microsoft/fast-element';
import type { TableColumnTextCellRecord, TableColumnTextColumnConfig } from '.';
import type { TableCellState } from '../base/types';

const getCellContent = (cellState: TableCellState<TableColumnTextCellRecord, TableColumnTextColumnConfig>): string => {
    return (typeof cellState.cellRecord.value === 'string'
        ? cellState.cellRecord.value
        : cellState.columnConfig.placeholder);
};
const setTitleWhenOverflow = (span: HTMLElement, title: string): void => {
    if (title && span.offsetWidth < span.scrollWidth) {
        span.setAttribute('title', title);
    }
};
export const cellTemplate = html<
TableCellState<TableColumnTextCellRecord, TableColumnTextColumnConfig>
>`
    <span
        class="${x => (typeof x.cellRecord.value === 'string' ? '' : 'placeholder')}"
        @mouseover="${(x, c) => setTitleWhenOverflow(c.event.target as HTMLElement, getCellContent(x))}"
        @mouseout="${(_x, c) => (c.event.target as HTMLElement).removeAttribute('title')}"
    >
        ${x => getCellContent(x)}
    </span>
`;
