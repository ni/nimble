import { html, ref } from '@microsoft/fast-element';
import type { TableColumnTextGroupHeaderView } from '.';
import { removeTitle, setTitleWhenOverflow } from '../template-helpers';

export const template = html<TableColumnTextGroupHeaderView>`
    <span
        ${ref('textSpan')}
        class="${x => (typeof x.groupHeaderValue === 'string' ? '' : 'placeholder')}"
        @mouseover="${x => setTitleWhenOverflow(x.textSpan, x.content)}"
        @mouseout="${x => removeTitle(x.textSpan)}"
    >
        ${x => x.content}
    </span>
`;
