import { html } from '@microsoft/fast-element';
import type { TableColumnTextCellRecord, TableColumnTextColumnConfig } from '.';
import type { TableCellState } from '../../table/types';

export const cellTemplate = html<
TableCellState<TableColumnTextCellRecord, TableColumnTextColumnConfig>
>`
    <span
        class="${x => (typeof x.cellRecord.value === 'string' ? '' : 'placeholder')}"
        @mouseover="${(_x, c) => {
        const span = c.event.target as HTMLSpanElement;
        if (span?.textContent?.trim() && span.offsetWidth < span.scrollWidth) {
            span.setAttribute('title', span.textContent.trim());
        }
    }
}"
        @mouseout="${(_x, c) => (c.event.target as HTMLElement).removeAttribute('title')}"
    >
        ${x => (typeof x.cellRecord.value === 'string'
        ? x.cellRecord.value
        : x.columnConfig.placeholder)}
    </span>
`;