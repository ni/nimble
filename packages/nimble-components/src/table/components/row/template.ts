import { html, repeat, when } from '@microsoft/fast-element';
import { DesignSystem } from '@microsoft/fast-foundation';
import type { TableRow, ColumnState } from '.';
import { TableCell } from '../cell';

// prettier-ignore
export const template = html<TableRow>`
    <template role="row">
        ${repeat(x => x.columnStates, html<ColumnState, TableRow>`
            <${DesignSystem.tagFor(TableCell)}
                class="cell ${(x, c) => (c.parent.menuIsOpen && c.parent.currentActionMenuColumn === x.column ? 'menu-open' : '')}"
                :cellTemplate="${x => x.column.cellTemplate}"
                :cellStyles="${x => x.column.cellStyles}"
                :cellState="${x => x.cellState}"
                :hasActionMenu="${x => !!x.column.actionMenuSlot}"
                :actionMenuLabel="${x => x.column.actionMenuLabel}"
                @cell-action-menu-beforetoggle="${(x, c) => c.parent.onCellActionMenuBeforeToggle(c.event as CustomEvent, x.column)}"
                @cell-action-menu-toggle="${(x, c) => c.parent.onCellActionMenuToggle(c.event as CustomEvent, x.column)}"
            >

                ${when((x, c) => ((c.parent as TableRow).currentActionMenuColumn === x.column) && x.column.actionMenuSlot, html<ColumnState, TableRow>`
                    <slot
                        name="${x => `row-action-menu-${x.column.actionMenuSlot}`}"
                        slot="cellActionMenu"
                    ></slot>
                `)}
            </${DesignSystem.tagFor(TableCell)}>
        `)}
    </template>
`;
