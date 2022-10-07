import { html, ref } from '@microsoft/fast-element';
import type { TableRow } from '.';

export const template = html<TableRow>`
    <template>
        <div ${ref('rowContainer')} class="table-row" style="               
                display: flex; 
                flex-direction: row;
                ">
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
