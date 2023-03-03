import { html } from '@microsoft/fast-element';
import type { TableColumnTextCellRecord, TableColumnTextColumnConfig } from '.';
import type { TableCellState } from '../../table/types';

const setTitleWhenOverflow = (span: HTMLElement): void => {
    if (span?.textContent?.trim() && span.offsetWidth < span.scrollWidth) {
        span.setAttribute('title', span.textContent.trim());
    }
};
export const cellTemplate = html<
TableCellState<TableColumnTextCellRecord, TableColumnTextColumnConfig>
>`
    <span
        class="${x => (typeof x.cellRecord.value === 'string' ? '' : 'placeholder')}"
        @mouseover="${(_x, c) => setTitleWhenOverflow(c.event.target as HTMLElement)}"
        @mouseout="${(_x, c) => (c.event.target as HTMLElement).removeAttribute('title')}"
    >
        ${x => (typeof x.cellRecord.value === 'string'
        ? x.cellRecord.value
        : x.columnConfig.placeholder)}
    </span>
`;
