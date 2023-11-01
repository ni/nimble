/* eslint-disable @typescript-eslint/indent */
import { html, ref } from '@microsoft/fast-element';
import type { TableColumnSelectCellView } from '.';
import { selectTag } from '../../../select';
import { listOptionTag } from '../../../list-option';

// prettier-ignore
export const template = html<TableColumnSelectCellView>`
    <template>
        <${selectTag}
            ${ref('select')}
        >
            <${listOptionTag}>Test 1</${listOptionTag}>
            <${listOptionTag}>Test 2</${listOptionTag}>
        </${selectTag}>
    </template>
`;
