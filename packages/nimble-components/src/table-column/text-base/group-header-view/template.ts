import { html } from '@microsoft/fast-element';
import type { TableColumnTextGroupHeaderViewBase } from '.';
import { overflow } from '../../../utilities/directive/overflow';

export const template = html<TableColumnTextGroupHeaderViewBase>`
    <span
        ${overflow('hasOverflow')}
        class="${x => (x.shouldUsePlaceholder ? 'placeholder' : '')}"
        title="${x => (x.hasOverflow && x.content ? x.content : undefined)}"
    >
        ${x => x.content}
    </span>
`;
