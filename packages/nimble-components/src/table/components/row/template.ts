import { html, ref, repeat, when } from '@microsoft/fast-element';
import type { TableRow } from '.';
import type { MenuButtonToggleEventDetail } from '../../../menu-button/types';
import { tableCellTag } from '../cell';
import { checkboxTag } from '../../../checkbox';
import { tableRowSelectLabel } from '../../../label-provider/table/label-tokens';
import type { TableColumn } from '../../../table-column/base';

// prettier-ignore
export const template = html<TableRow>`
    <template role="row" aria-selected=${x => x.ariaSelected}>
        ${when(x => !x.rowOperationGridCellHidden, html<TableRow>`
            <span role="gridcell" class="row-operations-container">
                ${when(x => x.selectable && !x.hideSelection, html<TableRow>`
                    <${checkboxTag}
                        ${ref('selectionCheckbox')}
                        class="selection-checkbox"
                        @change="${(x, c) => x.onSelectionChange(c.event as CustomEvent)}"
                        @click="${(_, c) => c.event.stopPropagation()}"
                        title="${x => tableRowSelectLabel.getValueFor(x)}"
                        aria-label="${x => tableRowSelectLabel.getValueFor(x)}"
                    >
                    </${checkboxTag}>
                `)}
            </span>
        `)}
        ${'' /* This is needed to help align the cell widths exactly with the column headers, due to the space reserved for
                the collapse-all button in the header. */}
        <span class="row-front-spacer"></span>

        <span ${ref('cellContainer')} class="cell-container">
            ${repeat(x => x.columns, html<TableColumn, TableRow>`
                ${when(x => !x.columnHidden, html<TableColumn, TableRow>`
                    <${tableCellTag}
                        class="cell"
                        :cellState="${(_, c) => c.parent.cellStates[c.index]}"
                        :cellViewTemplate="${x => x.columnInternals.cellViewTemplate}"
                        :column="${x => x}"
                        column-id="${x => x.columnId}"
                        :recordId="${(_, c) => c.parent.recordId}"
                        ?has-action-menu="${x => !!x.actionMenuSlot}"
                        action-menu-label="${x => x.actionMenuLabel}"
                        @cell-action-menu-beforetoggle="${(x, c) => c.parent.onCellActionMenuBeforeToggle(c.event as CustomEvent<MenuButtonToggleEventDetail>, x)}"
                        @cell-action-menu-toggle="${(x, c) => c.parent.onCellActionMenuToggle(c.event as CustomEvent<MenuButtonToggleEventDetail>, x)}"
                        :nestingLevel="${(_, c) => c.parent.cellIndentLevels[c.index]};"
                    >

                        ${when((x, c) => ((c.parent as TableRow).currentActionMenuColumn === x) && x.actionMenuSlot, html<TableColumn, TableRow>`
                            <slot
                                name="${x => `row-action-menu-${x.actionMenuSlot!}`}"
                                slot="cellActionMenu"
                            ></slot>
                        `)}
                    </${tableCellTag}>
                `)}
            `, { recycle: false, positioning: true })}
        </span>
    </template>
`;
