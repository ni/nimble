/* eslint-disable @typescript-eslint/indent */
import { html, ref, repeat } from '@microsoft/fast-element';
import type { TableColumnSelectCellView } from '.';
import { selectTag } from '../../../select';
import type { ListOption } from '../../../list-option';
import { listOptionTag } from '../../../list-option';

// prettier-ignore
export const template = html<TableColumnSelectCellView>`
    <template
        @click="${(x, c) => {
            if (typeof x.cellRecord.items === 'string') {
                c.event.stopPropagation();
            }
            return true;
        }}"
    >
        <${selectTag}
            error-text="${x => x.columnConfig.placeholder}"
            value="${x => x.cellRecord['selected-item']}"
            @change="${(x, c) => x.cellSelectChanged(c.event as CustomEvent)}"
        >
            ${repeat(x => x.items, html<ListOption>`
                <${listOptionTag}>
                    ${x => x}
                </${listOptionTag}>
            `)}
        </${selectTag}>
    </template>
`;
