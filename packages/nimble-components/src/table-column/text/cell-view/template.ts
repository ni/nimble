import { html, when } from '@microsoft/fast-element';

import type { TableColumnTextCellView } from '.';
import { overflow } from '../../../utilities/directive/overflow';
import { TableColumnAlignment } from '../../../table/types';
import { textFieldTag } from '../../../text-field';

// prettier-ignore
export const template = html<TableColumnTextCellView>`
    <template
        class="
            ${x => (x.alignment === TableColumnAlignment.right ? 'right-align' : '')}
            ${x => (x.isPlaceholder ? 'placeholder' : '')}
        "
    >
    ${when(x => x.isEditable, html<TableColumnTextCellView>`
        <${textFieldTag} value=${x => (!x.isPlaceholder ? x.text : '')}></${textFieldTag}>
    `)}
    ${when(x => !x.isEditable, html<TableColumnTextCellView>`
        <span
            ${overflow('hasOverflow')}
            title=${x => (x.hasOverflow && x.text ? x.text : null)}
        >
            ${x => x.text}
        </span>
    `)}
    </template>
`;
