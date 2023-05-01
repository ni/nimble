import { html, ref } from '@microsoft/fast-element';
import type { TableColumnTextGroupHeaderView } from '.';

export const template = html<TableColumnTextGroupHeaderView>`
    <span
        ${ref('textSpan')}
        class="${x => (typeof x.groupHeaderValue === 'string' ? '' : 'placeholder')}"
        @mouseover="${x => x.updateTitleOverflow()}"
        @mouseout="${x => x.clearTitleOverflow()}"
        title="${x => (x.isValidContentAndHasOverflow && x.content
        ? x.content
        : undefined)}"
    >
        ${x => x.content}
    </span>
`;
