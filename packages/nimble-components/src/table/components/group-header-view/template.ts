import { html, ViewTemplate } from '@microsoft/fast-element';
import type { TableGroupRow } from '../group-row';

export const createGroupHeaderViewTemplate = (
    groupHeaderViewTag: string
): ViewTemplate<TableGroupRow> | undefined => html<TableGroupRow>`
        <${groupHeaderViewTag}
            :groupHeaderValue="${x => x.groupRowValue}"
            :columnConfig="${x => x.groupColumn?.columnConfig}"
            class="group-header-value"
            >
        </${groupHeaderViewTag}>
    `;
