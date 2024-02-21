import { html } from '@microsoft/fast-element';

import type { TableColumnTextCellViewBase } from '.';
import { overflow } from '../../../utilities/directive/overflow';
import { TextCellViewBaseAlignment } from './types';

export const template = html<TableColumnTextCellViewBase>`
    <template
        class="${x => (x.alignment === TextCellViewBaseAlignment.right
        ? 'right-align'
        : '')}"
    >
        <span
            ${overflow('hasOverflow')}
            title=${x => (x.hasOverflow && x.text ? x.text : null)}
        >
            ${x => x.text}
        </span>
    </template>
`;
