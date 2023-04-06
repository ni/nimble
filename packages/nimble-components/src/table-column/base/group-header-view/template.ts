import { html, ViewTemplate } from '@microsoft/fast-element';
import type { TableGroupRow } from '../../../table/components/group-row';

export const createGroupHeaderViewTemplate = (
    groupHeaderViewTag: string
): ViewTemplate<TableGroupRow> => html<TableGroupRow>`
        <${groupHeaderViewTag}
            :groupHeaderValue="${x => x.groupRowValue}"
            :columnConfig="${x => x.groupColumn?.columnConfig}"
            class="group-header-value"
            >
        </${groupHeaderViewTag}>
    `;
