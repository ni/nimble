import { html, ref } from '@microsoft/fast-element';
import type { TableRow } from '.';

export const template = html<TableRow>`
    <template style="height: 32px">
        <div ${ref('rowContainer')} class="table-row" style="               
                display: flex; 
                flex-direction: row;
                ">
        </div>
    </template>
`;