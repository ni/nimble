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
                class="cell ${(x, c) => ((c.parent as TableRow).menuIsOpen && ((c.parent as TableRow).currentActionMenuColumn === x) ? 'menu-open' : '')}"
                ?show-action-menu="${x => x.showActionMenu}"
                :cellTemplate="${x => x.cellTemplate}"
                :cellStyles="${x => x.cellStyles}"
                :data="${(x, c) => (c.parent as TableRow).getCellValue(x)}"
                @action-menu-opening="${(x, c) => (c.parent as TableRow).onCellActionMenuOpening(x)}"
                @action-menu-open-change="${(_, c) => (c.parent as TableRow).onCellActionMenuOpenChange(c.event as CustomEvent)}"
            >
                <slot name="${(x, c) => (((c.parent as TableRow).currentActionMenuColumn === x) ? 'rowActionMenu' : 'unused_rowActionMenu')}" slot="cellActionMenu"></slot>
            </${DesignSystem.tagFor(TableCell)}>
        `)}
    </template>
`;
