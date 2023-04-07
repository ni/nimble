import { type ViewTemplate, html } from '@microsoft/fast-element';
import type { TableCell } from '../../../table/components/cell';

export const createCellViewTemplate = (
    cellViewTag: string
): ViewTemplate<TableCell> => html<TableCell>`
    <${cellViewTag}
        :cellRecord="${y => y.cellState?.cellRecord}"
        :columnConfig="${y => y.cellState?.columnConfig}"
        class="cell-view"
    >
    </${cellViewTag}>
`;
