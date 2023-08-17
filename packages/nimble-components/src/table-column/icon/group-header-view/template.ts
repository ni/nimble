import { html, when } from '@microsoft/fast-element';

import type { TableColumnIconGroupHeaderView } from '.';
import { spinnerTag } from '../../../spinner';
import { overflow } from '../../../utilities/directive/overflow';

// prettier-ignore
export const template = html<TableColumnIconGroupHeaderView>`
    ${when(
        x => x.visual === 'icon',
        html<TableColumnIconGroupHeaderView>`
            ${x => x.iconTemplate!}
            <span    
                ${overflow('hasOverflow')}
                title="${x => (x.hasOverflow && x.text ? x.text : null)}"
            >${x => x.text}</span>`
    )}
    ${when(
        x => x.visual === 'spinner',
        html<TableColumnIconGroupHeaderView>`
        <${spinnerTag}
            title="${x => x.text}"
            aria-label="${x => x.text}"
            class="no-shrink">
        </${spinnerTag}>
        <span    
            ${overflow('hasOverflow')}
            title="${x => (x.hasOverflow && x.text ? x.text : null)}"
        >${x => x.text}</span>
    `
    )}
`;
