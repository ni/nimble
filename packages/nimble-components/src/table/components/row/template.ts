import { html, ref, repeat, when } from '@microsoft/fast-element';
import type { TableRow, ColumnState } from '.';
import type { MenuButtonToggleEventDetail } from '../../../menu-button/types';
import { tableCellTag } from '../cell';
import { checkboxTag } from '../../../checkbox';

// prettier-ignore
export const template = html<TableRow>`
    <template role="row" aria-selected=${x => x.ariaSelected}>
        ${when(x => x.selectable && !x.hideSelection, html<TableRow>`
            <span role="gridcell" class="checkbox-container">
                <${checkboxTag}
                    ${ref('selectionCheckbox')}
                    role="cell"
                    class="selection-checkbox"
                    @change="${(x, c) => x.onSelectionChange(c.event as CustomEvent)}"
                    @click="${(_, c) => c.event.stopPropagation()}"
                >
                </${checkboxTag}>
            </span>
        `)}
        ${'' /* This is needed to help align the cell widths exactly with the column headers, due to the space reserved for
                the collapse-all button in the header. */}
        <span class="row-front-spacer"></span>

        <span ${ref('cellContainer')} class="cell-container">
            ${repeat(x => x.columnStates, html<ColumnState, TableRow>`
                ${when(x => !x.column.columnHidden, html<ColumnState, TableRow>`
                    <${tableCellTag}
                        class="cell"
                        :cellState="${x => x.cellState}"
                        :cellViewTemplate="${x => x.column.columnInternals.cellViewTemplate}"
                        :column="${x => x.column}"
                        ?has-action-menu="${x => !!x.column.actionMenuSlot}"
                        action-menu-label="${x => x.column.actionMenuLabel}"
                        @cell-action-menu-beforetoggle="${(x, c) => c.parent.onCellActionMenuBeforeToggle(c.event as CustomEvent<MenuButtonToggleEventDetail>, x.column)}"
                        @cell-action-menu-toggle="${(x, c) => c.parent.onCellActionMenuToggle(c.event as CustomEvent<MenuButtonToggleEventDetail>, x.column)}"
                        :nestingLevel="${x => x.cellIndentLevel};"
                    >

                        ${when((x, c) => ((c.parent as TableRow).currentActionMenuColumn === x.column) && x.column.actionMenuSlot, html<ColumnState, TableRow>`
                            <slot
                                name="${x => `row-action-menu-${x.column.actionMenuSlot!}`}"
                                slot="cellActionMenu"
                            ></slot>
                        `)}
                    </${tableCellTag}>
                `)}
            `)}
        </span>
    </template>
`;
