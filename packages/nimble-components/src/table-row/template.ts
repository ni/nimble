import { html, ref, repeat } from '@microsoft/fast-element';
import type { Cell } from '@tanstack/table-core';
import type { TableRow } from '.';

export const template = html<TableRow>`
    <template style="height: 32px">
        <div ${ref('rowContainer')} class="table-row" style="               
                display: flex; 
                flex-direction: row;
                ">

            ${repeat(x => x.rowData.row.getVisibleCells(), html<Cell<unknown, unknown>>`
                <nimble-table-cell 
                    :cellItemTemplate=${(x, c) => (c.parent as TableRow).getColumnTemplate(x)}
                    :cellData=${x => x.getValue()} 
                    >
                </nimble-table-cell>
            `)}
        </div>
    </template>
`;

// ${repeat(x => x.rowData.row.getVisibleCells(), html<Cell<unknown, unknown>>`
// <nimble-table-cell 
//     :cellItemTemplate=${(_, c) => (c.parent as TableRow)!.parent.getColumnTemplate(c.index)}
//     :cellData=${x => x.getValue()} 
//     >
// </nimble-table-cell>
// `, { positioning: true })}
