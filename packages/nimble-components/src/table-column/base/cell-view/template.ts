import { type ViewTemplate, html, repeat } from '@microsoft/fast-element';
import type { TableCell } from '../../../table/components/cell';
import { TableCellView } from '.';
import { uniquifySlotNameForColumn } from '../../../table/models/utilities';

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
            :recordId="${y => y.recordId}"
            class="cell-view"
        >
            ${repeat(y => y.column?.columnInternals.slotNames || [], html<string, TableCell>`
                <slot
                    name="${(x, c) => uniquifySlotNameForColumn(c.parent.column!, x)}"
                    slot="${x => x}"
                ></slot>
            `)}
        </${cellViewTag}>
    `;
};
