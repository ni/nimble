import { html } from '@microsoft/fast-element';
import type { TableColumnTextGroupHeaderView } from '.';
import { removeTitle, setTitleWhenOverflow } from '../template-helpers';

export const template = html<TableColumnTextGroupHeaderView>`
    <span
        class="${x => (typeof x.groupHeaderValue === 'string' ? '' : 'placeholder')}"
        @mouseover="${(x, c) => setTitleWhenOverflow(c.event.target as HTMLElement, x.content)}"
        @mouseout="${(_x, c) => removeTitle(c.event.target as HTMLElement)}"
    >
        ${x => x.content}
    </span>
`;
