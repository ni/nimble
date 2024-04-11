import { html, when } from '@microsoft/fast-element';

import type { TableColumnIconGroupHeaderView } from '.';
import { overflow } from '../../../utilities/directive/overflow';

// prettier-ignore
export const template = html<TableColumnIconGroupHeaderView>`
    ${when(
        x => x.visual === 'icon' || x.visual === 'spinner',
        html<TableColumnIconGroupHeaderView>`
            <span class="reserve-icon-size">${x => x.iconTemplate!}</span>
            <span
                ${overflow('hasOverflow')}
                title="${x => (x.hasOverflow && x.text ? x.text : null)}"
                class="text"
            >${x => x.text}</span>`
    )}
    ${when(
        x => x.visual === undefined,
        html<TableColumnIconGroupHeaderView>`
        <span
            ${overflow('hasOverflow')}
            title="${x => (x.hasOverflow && x.text ? x.text : null)}"
            class="text"
        >${x => x.text}</span>
    `
    )}
`;
