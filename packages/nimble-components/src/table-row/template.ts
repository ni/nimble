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