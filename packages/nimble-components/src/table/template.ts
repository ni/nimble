import {
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
    TableActionMenuToggleEventDetail,
    TableColumnSortDirection,
    TableRowSelectionMode,
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
        aria-multiselectable="${x => x.ariaMultiSelectable}"
        ${children({ property: 'childItems', filter: elements() })}
    >
        <div class="table-container ${x => (x.documentShiftKeyDown ? 'disable-select' : '')}"
            style="
            --ni-private-table-scroll-x: -${x => x.scrollX}px;
            --ni-private-table-header-container-margin-right: ${x => x.virtualizer.headerContainerMarginRight}px;
            --ni-private-table-scroll-height: ${x => x.virtualizer.scrollHeight}px;
            --ni-private-table-row-container-top: ${x => x.virtualizer.rowContainerYOffset}px;
            --ni-private-table-row-grid-columns: ${x => x.rowGridColumns ?? ''};
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
                                        class="${x => `selection-checkbox ${x.selectionMode ?? ''}`}"
                                        @change="${(x, c) => x.onAllRowsSelectionChange(c.event as CustomEvent)}"
                                        title="${x => tableSelectAllLabel.getValueFor(x)}"
                                        aria-label="${x => tableSelectAllLabel.getValueFor(x)}"
                                    >
                                    </${checkboxTag}>
                                </span>
                            `)}
                            <${buttonTag}
                                class="collapse-all-button ${x => `${x.showCollapseAll ? 'visible' : ''}`}"
                                content-hidden
                                appearance="${ButtonAppearance.ghost}"
                                title="${x => tableCollapseAllLabel.getValueFor(x)}"
                                @click="${x => x.handleCollapseAllGroupRows()}"
                            >
                                <${iconTriangleTwoLinesHorizontalTag} slot="start"></${iconTriangleTwoLinesHorizontalTag}>
                                ${x => tableCollapseAllLabel.getValueFor(x)}
                            </${buttonTag}>
                        </span>
                        <span class="column-headers-container" ${ref('columnHeadersContainer')}>
                            ${repeat(x => x.visibleColumns, html<TableColumn, Table>`
                                <div class="header-container">
                                    ${when((_, c) => c.index > 0, html<TableColumn, Table>`
                                        <div class="column-divider left ${(_, c) => `${c.parent.layoutManager.activeColumnIndex === c.index ? 'active' : ''}`}" 
                                             @mousedown="${(_, c) => c.parent.onLeftDividerMouseDown(c.event as MouseEvent, c.index)}">
                                        </div>
                                    `)}
                                        <${tableHeaderTag}
                                            class="header"
                                            sort-direction="${x => (typeof x.columnInternals.currentSortIndex === 'number' ? x.columnInternals.currentSortDirection : TableColumnSortDirection.none)}"
                                            ?first-sorted-column="${(x, c) => x === c.parent.firstSortedColumn}"
                                            @click="${(x, c) => c.parent.toggleColumnSort(x, (c.event as MouseEvent).shiftKey)}"
                                            :isGrouped=${x => (typeof x.columnInternals.groupIndex === 'number' && !x.columnInternals.groupingDisabled)}
                                        >
                                            <slot name="${x => x.slot}"></slot>
                                        </${tableHeaderTag}>
                                    ${when((_, c) => c.index < c.length - 1, html<TableColumn, Table>`
                                        <div class="column-divider right ${(_, c) => `${c.parent.layoutManager.activeColumnIndex === c.index ? 'active' : ''}`}"
                                             @mousedown="${(_, c) => c.parent.onRightDividerMouseDown(c.event as MouseEvent, c.index)}">
                                        </div>
                                    `)}                        
                                </div>
                            `, { positioning: true })}
                            <div class="header-scrollbar-spacer"></div>
                        </span>
                    </div>
                </div>
                <div class="table-viewport" ${ref('viewport')}>
                    <div class="table-scroll"></div>
                    <div class="table-row-container" ${children({ property: 'rowElements', filter: elements(tableRowTag) })}
                        role="rowgroup">
                        ${when(x => x.columns.length > 0 && x.canRenderRows, html<Table>`
                            ${repeat(x => x.virtualizer.visibleItems, html<VirtualItem, Table>`
                                ${when((x, c) => (c.parent as Table).tableData[x.index]?.isGroupRow, html<VirtualItem, Table>`
                                    <${tableGroupRowTag}
                                        class="group-row"
                                        :groupRowValue="${(x, c) => c.parent.tableData[x.index]?.groupRowValue}"
                                        ?expanded="${(x, c) => c.parent.tableData[x.index]?.isExpanded}"
                                        :nestingLevel="${(x, c) => c.parent.tableData[x.index]?.nestingLevel}"
                                        :immediateChildCount="${(x, c) => c.parent.tableData[x.index]?.immediateChildCount}"
                                        :groupColumn="${(x, c) => c.parent.tableData[x.index]?.groupColumn}"
                                        ?selectable="${(_, c) => c.parent.selectionMode === TableRowSelectionMode.multiple}"
                                        selection-state="${(x, c) => c.parent.tableData[x.index]?.selectionState}"
                                        @group-selection-toggle="${(x, c) => c.parent.onRowSelectionToggle(x.index, c.event as CustomEvent<TableRowSelectionToggleEventDetail>)}"
                                        @group-expand-toggle="${(x, c) => c.parent.handleGroupRowExpanded(x.index, c.event)}"
                                    >
                                    </${tableGroupRowTag}>
                                `)}
                                ${when((x, c) => !(c.parent as Table).tableData[x.index]?.isGroupRow, html<VirtualItem, Table>`
                                    <${tableRowTag}
                                        class="row"
                                        record-id="${(x, c) => c.parent.tableData[x.index]?.id}"
                                        ?selectable="${(_, c) => c.parent.selectionMode !== TableRowSelectionMode.none}"
                                        selection-state="${(x, c) => c.parent.tableData[x.index]?.selectionState}"
                                        ?expanded="${(x, c) => c.parent.tableData[x.index]?.isExpanded}"
                                        ?hide-selection="${(_, c) => c.parent.selectionMode !== TableRowSelectionMode.multiple}"
                                        :dataRecord="${(x, c) => c.parent.tableData[x.index]?.record}"
                                        :columns="${(_, c) => c.parent.columns}"
                                        :isParentRow="${(x, c) => c.parent.tableData[x.index]?.isParentRow}"
                                        :nestingLevel="${(x, c) => c.parent.tableData[x.index]?.nestingLevel}"
                                        ?row-operation-grid-cell-hidden="${(_, c) => !c.parent.showRowOperationColumn}"
                                        @click="${(x, c) => c.parent.onRowClick(x.index, c.event as MouseEvent)}"
                                        @row-selection-toggle="${(x, c) => c.parent.onRowSelectionToggle(x.index, c.event as CustomEvent<TableRowSelectionToggleEventDetail>)}"
                                        @row-action-menu-beforetoggle="${(x, c) => c.parent.onRowActionMenuBeforeToggle(x.index, c.event as CustomEvent<TableActionMenuToggleEventDetail>)}"
                                        @row-action-menu-toggle="${(_, c) => c.parent.onRowActionMenuToggle(c.event as CustomEvent<TableActionMenuToggleEventDetail>)}"
                                        @row-expand-toggle="${(x, c) => c.parent.handleRowExpanded(x.index)}"
                                        :dataIndex="${x => x.index}"
                                        ?acts-like-group="${(x, c) => c.parent.leafMode && c.parent.tableData[x.index]?.isParentRow}"
                                    >
                                    ${when((x, c) => (c.parent as Table).openActionMenuRecordId === (c.parent as Table).tableData[x.index]?.id, html<VirtualItem, Table>`
                                        ${repeat((_, c) => (c.parent as Table).actionMenuSlots, html<string, Table>`
                                            <slot
                                                name="${x => x}"
                                                slot="${x => `row-action-menu-${x}`}">
                                            </slot>
                                        `)}
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
