import { html } from '@microsoft/fast-element';

import type { TableColumnTextCellViewBase } from '.';
import { overflow } from '../../../utilities/directive/overflow';
import { TextCellViewBaseAlignment } from './types';

// prettier-ignore
export const template = html<TableColumnTextCellViewBase>`
    <template
        class="
            ${x => (x.alignment === TextCellViewBaseAlignment.right ? 'right-align' : '')}
            ${x => (x.isPlaceholder ? 'placeholder' : '')}
        "
    >
        <span
            ${overflow('hasOverflow')}
            title=${x => (x.hasOverflow && x.text ? x.text : null)}
        >
            ${x => x.text}
        </span>
    </template>
`;
