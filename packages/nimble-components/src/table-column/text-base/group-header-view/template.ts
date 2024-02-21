import { html } from '@microsoft/fast-element';
import type { TableColumnTextGroupHeaderViewBase } from '.';
import { overflow } from '../../../utilities/directive/overflow';

export const template = html<TableColumnTextGroupHeaderViewBase>`
    <span
        ${overflow('hasOverflow')}
        title="${x => (x.hasOverflow && x.text ? x.text : null)}"
    >
        ${x => x.text}
    </span>
`;
