import {
    ExecutionContext,
    children,
    elements,
    html,
    ref,
    repeat,
    when
} from '@microsoft/fast-element';
import type { VirtualItem } from '@tanstack/virtual-core';
import type { Table } from '.';
import { tableHeaderTag } from './components/header';
import { tableRowTag } from './components/row';
import type { TableColumn } from '../table-column/base';
import {
    RowSlotRequestEventDetail,
    SlotMetadata,
    TableActionMenuToggleEventDetail,
    TableColumnSortDirection,
    TableRowSelectionMode,
    TableRowSelectionState,
    TableRowSelectionToggleEventDetail
} from './types';
import { tableGroupRowTag } from './components/group-row';
import { buttonTag } from '../button';
import { ButtonAppearance } from '../button/types';
import { iconTriangleTwoLinesHorizontalTag } from '../icons/triangle-two-lines-horizontal';
import { checkboxTag } from '../checkbox';
import {
    tableCollapseAllLabel,
    tableRowOperationColumnLabel,
    tableSelectAllLabel
} from '../label-provider/table/label-tokens';

// prettier-ignore
export const template = html<Table>`
    <template
        role="treegrid"
        ${'' /* tabindex managed dynamically by KeyboardNavigationManager */}
        tabindex="0"
        aria-multiselectable="${x => x.ariaMultiSelectable}"
        ${children({ property: 'childItems', filter: elements() })}
    >
        <div class="table-container ${x => (x.windowShiftKeyDown ? 'disable-select' : '')}"
            style="
            --ni-private-table-scroll-x: -${x => x.scrollX}px;
            --ni-private-table-header-container-margin-right: ${x => x.virtualizer.headerContainerMarginRight}px;
            --ni-private-table-scroll-height: ${x => x.virtualizer.scrollHeight}px;
            --ni-private-table-row-container-top: ${x => x.virtualizer.rowContainerYOffset}px;
            --ni-private-table-row-grid-columns: ${x => (x.rowGridColumns ? x.rowGridColumns : '')};
            --ni-private-table-cursor-override: ${x => (x.layoutManager.isColumnBeingSized ? 'col-resize' : 'default')};
            --ni-private-table-scrollable-min-width: ${x => x.tableScrollableMinWidth}px;
            --ni-private-glass-overlay-pointer-events: ${x => (x.layoutManager.isColumnBeingSized ? 'none' : 'default')};
            ">
            <div class="glass-overlay">
                <div role="rowgroup" class="header-row-container">
                    <div class="header-row" role="row">
                        <span role="${x => (x.showRowOperationColumn ? 'columnheader' : '')}" class="header-row-action-container" ${ref('headerRowActionContainer')}>
                            ${when(x => x.showRowOperationColumn, html<Table>`
                                <span class="accessibly-hidden">
                                    ${x => tableRowOperationColumnLabel.getValueFor(x)}
                                </span>
                            `)}
                            ${when(x => x.selectionMode === TableRowSelectionMode.multiple, html<Table>`
                                <span class="checkbox-container">
                                    <${checkboxTag}
                                        ${ref('selectionCheckbox')}
                                        ${'' /* tabindex managed dynamically by KeyboardNavigationManager */}
                                        tabindex="-1"
                                        class="selection-checkbox"
                                        @change="${(x, c) => x.onAllRowsSelectionChange(c.event as CustomEvent)}"
                                        title="${x => tableSelectAllLabel.getValueFor(x)}"
                                        aria-label="${x => tableSelectAllLabel.getValueFor(x)}"
                                    >
                                    </${checkboxTag}>
                                </span>
                            `)}
                            <span class="collapse-all-button-container">
                                <${buttonTag}
                                    ${ref('collapseAllButton')}
                                    ${'' /* tabindex managed dynamically by KeyboardNavigationManager */}
                                    tabindex="-1"
                                    class="collapse-all-button ${x => x.collapseButtonVisibility}"
                                    content-hidden
                                    appearance="${ButtonAppearance.ghost}"
                                    title="${x => tableCollapseAllLabel.getValueFor(x)}"
                                    @click="${x => x.handleCollapseAllRows()}"
                                >
                                    <${iconTriangleTwoLinesHorizontalTag} slot="start"></${iconTriangleTwoLinesHorizontalTag}>
                                    ${x => tableCollapseAllLabel.getValueFor(x)}
                                </${buttonTag}>
                            </span>
                        </span>
                        <span class="column-headers-container" ${ref('columnHeadersContainer')}>
                            ${repeat(x => x.visibleColumns, html<TableColumn, Table>`
                                <div class="header-container">
                                    ${when((_, c) => c.index > 0, html<TableColumn, Table>`
                                        <div
                                            class="
                                                column-divider
                                                left
                                                ${(_, c) => `${c.parent.layoutManager.activeColumnIndex === c.index ? 'column-active' : ''}`}
                                                ${(_, c) => `${c.parent.layoutManager.activeColumnDivider === c.parent.getLeftDividerIndex(c.index) ? 'divider-active' : ''}`}
                                                ${(_, c) => `${c.parent.layoutManager.hasResizableColumnToLeft(c.index - 1) ? 'draggable' : ''}`}
                                            "
                                            @mousedown="${(_, c) => c.parent.onLeftDividerMouseDown(c.event as MouseEvent, c.index)}">
                                        </div>
                                    `)}
                                        <${tableHeaderTag}
                                            class="header"
                                            ${'' /* tabindex managed dynamically by KeyboardNavigationManager (if column sorting not disabled) */}
                                            sort-direction="${x => (typeof x.columnInternals.currentSortIndex === 'number' ? x.columnInternals.currentSortDirection : TableColumnSortDirection.none)}"
                                            ?first-sorted-column="${(x, c) => x === c.parent.firstSortedColumn}"
                                            ?indicators-hidden="${x => x.columnInternals.hideHeaderIndicators}"
                                            @keydown="${(x, c) => c.parent.onHeaderKeyDown(x, c.event as KeyboardEvent)}"
                                            @click="${(x, c) => c.parent.toggleColumnSort(x, (c.event as MouseEvent).shiftKey)}"
                                            :alignment="${x => x.columnInternals.headerAlignment}"
                                            :isGrouped=${x => (typeof x.columnInternals.groupIndex === 'number' && !x.columnInternals.groupingDisabled)}
                                        >
                                            <slot name="${x => x.slot}"></slot>
                                        </${tableHeaderTag}>
                                    ${when((_, c) => c.index < c.length - 1, html<TableColumn, Table>`
                                        <div
                                            class="
                                                column-divider
                                                right
                                                ${(_, c) => `${c.parent.layoutManager.activeColumnIndex === c.index ? 'column-active' : ''}`}
                                                ${(_, c) => `${c.parent.layoutManager.activeColumnDivider === c.parent.getRightDividerIndex(c.index) ? 'divider-active' : ''}`}
                                                ${(_, c) => `${c.parent.layoutManager.hasResizableColumnToLeft(c.index) ? 'draggable' : ''}`}
                                            "
                                             @mousedown="${(_, c) => c.parent.onRightDividerMouseDown(c.event as MouseEvent, c.index)}">
                                        </div>
                                    `)}                        
                                </div>
                            `, { positioning: true })}
                            <div class="header-scrollbar-spacer"></div>
                        </span>
                    </div>
                </div>
                <div class="table-viewport" tabindex="-1" ${ref('viewport')}>
                    <div class="table-scroll"></div>
                    <div class="table-row-container ${x => `${x.showCollapseAll ? 'collapse-all-visible' : ''}`}" ${children({ property: 'rowElements', filter: elements(`${tableRowTag}, ${tableGroupRowTag}`) })}
                        role="rowgroup">
                        ${when(x => x.columns.length > 0 && x.canRenderRows, html<Table>`
                            ${repeat(x => x.virtualizer.visibleItems, html<VirtualItem<HTMLElement>, Table>`
                                ${when((x, c: ExecutionContext<Table>) => c.parent.tableData[x.index]?.isGroupRow, html<VirtualItem<HTMLElement>, Table>`
                                    <${tableGroupRowTag}
                                        class="group-row"
                                        ${'' /* tabindex managed dynamically by KeyboardNavigationManager */}
                                        tabindex="-1"
                                        :groupRowValue="${(x, c) => c.parent.tableData[x.index]?.groupRowValue}"
                                        ?expanded="${(x, c) => c.parent.tableData[x.index]?.isExpanded}"
                                        :nestingLevel="${(x, c) => c.parent.tableData[x.index]?.nestingLevel}"
                                        :immediateChildCount="${(x, c) => c.parent.tableData[x.index]?.immediateChildCount}"
                                        :groupColumn="${(x, c) => c.parent.tableData[x.index]?.groupColumn}"
                                        ?selectable="${(_, c) => c.parent.selectionMode === TableRowSelectionMode.multiple}"
                                        selection-state="${(x, c) => c.parent.tableData[x.index]?.selectionState}"
                                        :resolvedRowIndex="${x => x.index}"
                                        @focusin="${(_, c) => c.parent.onRowFocusIn(c.event as FocusEvent)}"
                                        @blur="${(_, c) => c.parent.onRowBlur(c.event as FocusEvent)}"
                                        @group-selection-toggle="${(x, c) => c.parent.onRowSelectionToggle(x.index, c.event as CustomEvent<TableRowSelectionToggleEventDetail>)}"
                                        @group-expand-toggle="${(x, c) => c.parent.handleGroupRowExpanded(x.index, c.event)}"
                                    >
                                    </${tableGroupRowTag}>
                                `)}
                                ${when((x, c: ExecutionContext<Table>) => !c.parent.tableData[x.index]?.isGroupRow, html<VirtualItem<HTMLElement>, Table>`
                                    <${tableRowTag}
                                        class="row"
                                        ${'' /* tabindex managed dynamically by KeyboardNavigationManager */}
                                        tabindex="-1"
                                        record-id="${(x, c) => c.parent.tableData[x.index]?.id}"
                                        ?selectable="${(_, c) => c.parent.selectionMode !== TableRowSelectionMode.none}"
                                        ?selected="${(x, c) => c.parent.tableData[x.index]?.selectionState === TableRowSelectionState.selected}"
                                        ?expanded="${(x, c) => c.parent.tableData[x.index]?.isExpanded}"
                                        ?hide-selection="${(_, c) => c.parent.selectionMode !== TableRowSelectionMode.multiple}"
                                        ?reserve-collapse-space="${(_, c) => c.parent.canHaveCollapsibleRows}"
                                        :dataRecord="${(x, c) => c.parent.tableData[x.index]?.record}"
                                        :columns="${(_, c) => c.parent.columns}"
                                        :isParentRow="${(x, c) => c.parent.tableData[x.index]?.isParentRow}"
                                        :nestingLevel="${(x, c) => c.parent.tableData[x.index]?.nestingLevel}"
                                        ?row-operation-grid-cell-hidden="${(_, c) => !c.parent.showRowOperationColumn}"
                                        ?loading="${(x, c) => c.parent.tableData[x.index]?.isLoadingChildren}"
                                        :resolvedRowIndex="${x => x.index}"
                                        @click="${(x, c) => c.parent.onRowClick(x.index, c.event as MouseEvent)}"
                                        @focusin="${(_, c) => c.parent.onRowFocusIn(c.event as FocusEvent)}"
                                        @blur="${(_, c) => c.parent.onRowBlur(c.event as FocusEvent)}"
                                        @row-selection-toggle="${(x, c) => c.parent.onRowSelectionToggle(x.index, c.event as CustomEvent<TableRowSelectionToggleEventDetail>)}"
                                        @row-action-menu-beforetoggle="${(x, c) => c.parent.onRowActionMenuBeforeToggle(x.index, c.event as CustomEvent<TableActionMenuToggleEventDetail>)}"
                                        @row-action-menu-toggle="${(_, c) => c.parent.onRowActionMenuToggle(c.event as CustomEvent<TableActionMenuToggleEventDetail>)}"
                                        @row-slots-request="${(_, c) => c.parent.onRowSlotsRequest(c.event as CustomEvent<RowSlotRequestEventDetail>)}"
                                        @row-expand-toggle="${(x, c) => c.parent.handleRowExpanded(x.index)}"
                                    >
                                    ${when((x, c: ExecutionContext<Table>) => c.parent.openActionMenuRecordId === c.parent.tableData[x.index]?.id, html<VirtualItem<HTMLElement>, Table>`
                                        ${repeat((_, c: ExecutionContext<Table>) => c.parent.actionMenuSlots, html<string, Table>`
                                            <slot
                                                name="${x => x}"
                                                slot="${x => `row-action-menu-${x}`}">
                                            </slot>
                                        `)}
                                    `)}
                                    ${repeat((x, c: ExecutionContext<Table>) => (c.parent.tableData[x.index]?.slots || []), html<SlotMetadata>`
                                        <slot
                                            name="${x => x.name}"
                                            slot="${x => x.slot}"
                                        ></slot>
                                    `)}
                                    </${tableRowTag}>
                                `)}
                            `)}
                        `)}
                    </div>
                </div>
            </div>
        </div>
    </template>
`;
