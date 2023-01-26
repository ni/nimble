import { html, repeat } from '@microsoft/fast-element';
import { DesignSystem } from '@microsoft/fast-foundation';
import type { TableRow, ColumnState } from '.';
import { TableCell } from '../cell';

// prettier-ignore
export const template = html<TableRow>`
    <template role="row">
        ${repeat(x => x.columnStates, html<ColumnState, TableRow>`
            <${DesignSystem.tagFor(TableCell)}
                class="cell"
                :cellTemplate="${x => x.column.cellTemplate}"
                :cellStyles="${x => x.column.cellStyles}"
                :cellState="${x => x.cellState}"
            >
            </${DesignSystem.tagFor(TableCell)}>
        `)}
    </template>
`;
