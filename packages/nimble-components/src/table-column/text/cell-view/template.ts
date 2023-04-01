import { html, ref } from '@microsoft/fast-element';

import type { TableColumnTextCellView } from '.';

export const template = html<TableColumnTextCellView>`
    <span
        ${ref('textSpan')}
        class="${x => (typeof x.cellRecord.value === 'string' ? '' : 'placeholder')}"
        @mouseover="${x => {
        x.isValidContentAndHasOverflow = !!x.content && x.textSpan.offsetWidth < x.textSpan.scrollWidth;
    }}"
        @mouseout="${x => {
        x.isValidContentAndHasOverflow = false;
    }}"
        title=${x => (x.isValidContentAndHasOverflow ? x.content : null)}
    >
        ${x => x.content}
    </span>
`;
