import { type ViewTemplate, html } from '@microsoft/fast-element';
import type { TableCell } from '../../../table/components/cell';
import { TableCellView } from '.';

const validateCellViewTemplate = (cellViewTag: string): void => {
    let instance;
    try {
        instance = document.createElement(cellViewTag);
    } catch (ex) {
        // Swallow construction error to report a better one
    }
    if (!(instance instanceof TableCellView)) {
        throw new Error(
            `Cell view tag name (${cellViewTag}) must evaluate to an element extending TableCellView`
        );
    }
};

export const createCellViewTemplate = (
    cellViewTag: string
): ViewTemplate<TableCell> => {
    validateCellViewTemplate(cellViewTag);
    return html<TableCell>`
        <${cellViewTag}
            :cellRecord="${y => y.cellState?.cellRecord}"
            :columnConfig="${y => y.cellState?.columnConfig}"
            :column="${y => y.column}"
            class="cell-view"
        >
        </${cellViewTag}>
    `;
};
