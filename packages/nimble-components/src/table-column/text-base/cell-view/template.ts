import { html } from '@microsoft/fast-element';

import type { TableColumnTextCellViewBase } from '.';
import { overflow } from '../../../utilities/directive/overflow';

export const template = html<TableColumnTextCellViewBase>`
    <span
        ${overflow('hasOverflow')}
        class="${x => (x.shouldUsePlaceholder ? 'placeholder' : '')}"
        title=${x => (x.hasOverflow && x.content ? x.content : null)}
    >
        ${x => x.content}
    </span>
`;
