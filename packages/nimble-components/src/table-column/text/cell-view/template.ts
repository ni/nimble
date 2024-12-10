import { html, ref, when } from '@microsoft/fast-element';

import type { TableColumnTextCellView } from '.';
import { overflow } from '../../../utilities/directive/overflow';
import { TableColumnAlignment } from '../../../table/types';
import { textFieldTag } from '../../../text-field';

// prettier-ignore
export const template = html<TableColumnTextCellView>`
    <template
        @click=${x => x.handleClick()}
        class="
            ${x => (x.alignment === TableColumnAlignment.right ? 'right-align' : '')}
            ${x => (x.isPlaceholder ? 'placeholder' : '')}
            ${x => (x.isFocused ? 'focused' : '')}

        "
    >
    <${textFieldTag}
        ${ref('textField')}
        class="editable-field ${x => (!x.isEditing ? 'hidden' : '')}"
        value=${x => (!x.isPlaceholder ? x.text : '')}
        @blur=${x => x.handleBlur()}
    ></${textFieldTag}>
    ${when(x => !x.isEditing, html<TableColumnTextCellView>`
        <span
            ${overflow('hasOverflow')}
            title=${x => (x.hasOverflow && x.text ? x.text : null)}
        >
            ${x => x.text}
        </span>
    `)}
    </template>
`;
