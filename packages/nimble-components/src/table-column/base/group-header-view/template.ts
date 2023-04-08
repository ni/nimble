import { html, ViewTemplate } from '@microsoft/fast-element';
import type { TableGroupRow } from '../../../table/components/group-row';
import { TableGroupHeaderView } from '.';

const validateGroupHeaderViewTemplate = (
    groupHeaderViewTag: string
): void => {
    let instance;
    try {
        instance = document.createElement(groupHeaderViewTag);
    } catch (ex) {
        // Swallow construction error to report a better one
    }
    if (!(instance instanceof TableGroupHeaderView)) {
        throw new Error(`Group header view tag name (${groupHeaderViewTag}) must evaluate to an element extending TableGroupHeaderView`);
    }
};

export const createGroupHeaderViewTemplate = (
    groupHeaderViewTag: string
): ViewTemplate<TableGroupRow> => {
    validateGroupHeaderViewTemplate(groupHeaderViewTag);
    return html<TableGroupRow>`
        <${groupHeaderViewTag}
            :groupHeaderValue="${x => x.groupRowValue}"
            :columnConfig="${x => x.groupColumn?.columnInternals.columnConfig}"
            class="group-header-view"
        >
        </${groupHeaderViewTag}>
    `;
};
