import { html, ref, repeat, when } from '@ni/fast-element';
import type { TableRow } from '.';
import {
    ButtonAppearance,
    type MenuButtonToggleEventDetail
} from '../../../menu-button/types';
import { tableCellTag } from '../cell';
import { checkboxTag } from '../../../checkbox';
import {
    tableRowCollapseLabel,
    tableRowExpandLabel,
    tableRowLoadingLabel,
    tableRowSelectLabel
} from '../../../label-provider/table/label-tokens';
import type { TableColumn } from '../../../table-column/base';
import { buttonTag } from '../../../button';
import { iconArrowExpanderRightTag } from '../../../icons/arrow-expander-right';
import { spinnerTag } from '../../../spinner';
import { SpinnerAppearance } from '../../../spinner/types';
import type { CellViewSlotRequestEventDetail } from '../../types';
import { uniquifySlotNameForColumn } from '../../models/utilities';

// prettier-ignore
export const template = html<TableRow>`
    <template 
        role="row"
        aria-selected=${x => x.ariaSelected}
        aria-expanded=${x => x.expanded}
        style="--ni-private-table-row-indent-level: ${x => x.nestingLevel};"
    >
        ${when(x => !x.rowOperationGridCellHidden, html<TableRow>`
            <span role="gridcell" class="row-operations-container">
                ${when(x => x.showSelectionCheckbox, html<TableRow>`
                    <${checkboxTag}
                        ${ref('selectionCheckbox')}
                        class="selection-checkbox"
                        ${'' /* tabindex managed dynamically by KeyboardNavigationManager */}
                        tabindex="-1"
                        @change="${(x, c) => x.onSelectionCheckboxChange(c.event as CustomEvent)}"
                        @click="${(_, c) => c.event.stopPropagation()}"
                        title="${x => tableRowSelectLabel.getValueFor(x)}"
                        aria-label="${x => tableRowSelectLabel.getValueFor(x)}"
                    >
                    </${checkboxTag}>
                `)}
            </span>
        `)}
        <span class="row-front-spacer ${x => (x.isTopLevelParentRow || !x.reserveCollapseSpace ? 'reduced-size-spacer' : '')}"></span>
        ${when(x => x.isParentRow, html<TableRow>`
            ${when(x => x.loading, html<TableRow>`
                <span class="spinner-container">
                    <${spinnerTag}
                        appearance="${SpinnerAppearance.accent}"
                        aria-label="${x => tableRowLoadingLabel.getValueFor(x)}"
                        title="${x => tableRowLoadingLabel.getValueFor(x)}"
                    >
                    </${spinnerTag}>
                </span>
            `)}
            ${when(x => !x.loading, html<TableRow>`
                <${buttonTag}
                    appearance="${ButtonAppearance.ghost}"
                    content-hidden
                    class="expand-collapse-button"
                    tabindex="-1"
                    @click="${(x, c) => x.onRowExpandToggle(c.event)}"
                    title="${x => (x.expanded ? tableRowCollapseLabel.getValueFor(x) : tableRowExpandLabel.getValueFor(x))}"
                    aria-hidden="true"
                >
                    <${iconArrowExpanderRightTag} ${ref('expandIcon')} slot="start" class="expander-icon ${x => x.animationClass}"></${iconArrowExpanderRightTag}>
                </${buttonTag}>
            `)}
        `)}

        <span ${ref('cellContainer')} 
            class="cell-container ${x => (x.isNestedParent ? 'nested-parent' : '')}"
        >
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
                        @cell-view-slots-request="${(x, c) => c.parent.onCellViewSlotsRequest(x, c.event as CustomEvent<CellViewSlotRequestEventDetail>)}"
                        :nestingLevel="${(_, c) => c.parent.cellIndentLevels[c.index]}"
                    >

                        ${when((x, c) => ((c.parent as TableRow).currentActionMenuColumn === x) && x.actionMenuSlot, html<TableColumn, TableRow>`
                            <slot
                                name="${x => `row-action-menu-${x.actionMenuSlot!}`}"
                                slot="cellActionMenu"
                            ></slot>
                        `)}

                        ${repeat(x => x.columnInternals.slotNames, html<string, TableColumn>`
                            <slot
                                name="${(x, c) => uniquifySlotNameForColumn(c.parent, x)}"
                                slot="${(x, c) => uniquifySlotNameForColumn(c.parent, x)}"
                            ></slot>
                        `)}
                    </${tableCellTag}>
                `)}
            `, { recycle: false, positioning: true })}
        </span>
    </template>
`;
