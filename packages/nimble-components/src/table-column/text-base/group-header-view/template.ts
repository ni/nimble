import { html, ref } from '@microsoft/fast-element';
import type { TableColumnTextGroupHeaderViewBase } from '.';

export const template = html<TableColumnTextGroupHeaderViewBase>`
    <span
        ${ref('textSpan')}
        class="${x => (x.shouldUsePlaceholder ? 'placeholder' : '')}"
        @mouseover="${x => x.updateTitleOverflow()}"
        @mouseout="${x => x.clearTitleOverflow()}"
        title="${x => (x.hasOverflow && x.content ? x.content : undefined)}"
    >
        ${x => x.content}
    </span>
`;
