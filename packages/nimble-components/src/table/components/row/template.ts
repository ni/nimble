import { html, repeat } from '@microsoft/fast-element';
import { DesignSystem } from '@microsoft/fast-foundation';
import type { TableRow } from '.';
import { TableCell } from '../cell';
import type { TableColumn } from '../column/table-column';

// prettier-ignore
export const template = html<TableRow>`
    <template role="row">
        ${repeat(x => x.columns, html<TableColumn>`
            <${DesignSystem.tagFor(TableCell)}
                class="cell"
                :cellTemplate="${x => x.cellTemplate}"
                :cellStyles="${x => x.cellStyles}"
                :data="${(x, c) => (c.parent as TableRow).getCellValue(x)}"
            >
                <slot name="rowActionMenu" slot="cellActionMenu"></slot>
            </${DesignSystem.tagFor(TableCell)}>
        `)}
    </template>
`;
