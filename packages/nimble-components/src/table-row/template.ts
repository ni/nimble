import { html, ref, repeat } from '@microsoft/fast-element';
import type { TableRow } from '.';
import type { CellData } from '../table-cell';

export const template = html<TableRow>`
    <template style="height: 32px">
        <div ${ref('rowContainer')} class="table-row" style="               
                display: flex; 
                flex-direction: row;
                ">
            ${repeat(x => x.rowData.data!, html<CellData>`
                <nimble-table-cell 
                    :cellItemTemplate=${(x, c) => (c.parent as TableRow).getColumnTemplateById(x.columnId)}
                    :cellData=${x => x.value}
                    >
                    <slot name="rowActionMenu" slot="cellActionMenu"></slot>
                </nimble-table-cell>
            `)}
        </div>
    </template>
`;

// ${repeat(x => x.rowData.row.getVisibleCells(), html<Cell<unknown, unknown>>`
// <nimble-table-cell 
//     :cellItemTemplate=${(x, c) => (c.parent as TableRow).getColumnTemplate(x)}
//     :cellData=${x => x.getValue()}
//     :hasMenu=${(x, c) => (c.parent as TableRow).columnHasMenu(x)}
//     @action-menu-open=${(x, c) => (c.parent as TableRow).onCellActionMenuOpen(x)}
//     >
//     <slot name="rowActionMenu" slot="cellActionMenu"></slot>
// </nimble-table-cell>
// `)}
