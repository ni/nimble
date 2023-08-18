import { html } from '@microsoft/fast-element';

import type { TableColumnTextCellViewBase } from '.';
import { overflow } from '../../../utilities/directive/overflow';

export const template = html<TableColumnTextCellViewBase>`
    <template class="${x => (x.rightAlign ? 'right-align' : '')}">
        <span
            ${overflow('hasOverflow')}
            title=${x => (x.hasOverflow && x.text ? x.text : null)}
        >
            ${x => x.text}
        </span>
    </template>
`;
