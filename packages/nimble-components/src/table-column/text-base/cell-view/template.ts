import { html, ref } from '@microsoft/fast-element';

import type { TableColumnTextCellViewBase } from '.';

export const template = html<TableColumnTextCellViewBase>`
    <span
        ${ref('textSpan')}
        class="${x => (x.shouldUsePlaceholder ? 'placeholder' : '')}"
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
