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
    TableRowSelectionState,
    TableRowSelectionToggleEventDetail
} from './types';
import { tableGroupRowTag } from './components/group-row';
import { checkboxTag } from '../checkbox';

// prettier-ignore
export const template = html<Table>`
    <template
        role="grid"
        aria-multiselectable="${x => x.ariaMultiSelectable}"
        ${children({ property: 'childItems', filter: elements() })}
    >
        <div class="table-container" style="
            --ni-private-table-scroll-x: -${x => x.scrollX}px;
            --ni-private-table-header-scrollbar-spacer-width: ${x => x.virtualizer.headerContainerMarginRight}px;
            --ni-private-table-scroll-height: ${x => x.virtualizer.allRowsHeight}px;
            --ni-private-table-row-container-top: ${x => x.virtualizer.rowContainerYOffset}px; 
            --ni-private-table-row-grid-columns: ${x => x.rowGridColumns ?? ''}
            ">
            <div role="rowgroup" class="header-container">
                <div class="header-row" role="row">
                    ${when(x => x.selectionMode === TableRowSelectionMode.multiple, html<Table>`
                        <span role="columnheader" class="checkbox-container">
                            <${checkboxTag}
                                ${ref('selectionCheckbox')}
                                class="${x => `selection-checkbox ${x.selectionMode ?? ''}`}"
                                @change="${async (x, c) => x.onAllRowsSelectionChange(c.event as CustomEvent)}"
                            >
                            </${checkboxTag}>
                        </span>
                    `)}

                    <span class="column-header-container">
                        ${repeat(x => x.columns, html<TableColumn>`
                            ${when(x => !x.columnHidden, html<TableColumn, Table>`
                                <${tableHeaderTag}
                                    class="header"
                                    sort-direction="${x => (typeof x.sortIndex === 'number' ? x.sortDirection : TableColumnSortDirection.none)}"
                                    ?first-sorted-column="${(x, c) => x === c.parent.firstSortedColumn}"
                                >
                                    <slot name="${x => x.slot}"></slot>
                                </${tableHeaderTag}>
                            `)}
                        `)}
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
                            ${when((x, c) => (c.parent as Table).tableData[x.index]?.isGrouped, html<VirtualItem, Table>`
                                <${tableGroupRowTag}
                                    class="group-row"
                                    :groupRowValue="${(x, c) => c.parent.tableData[x.index]?.groupRowValue}"
                                    ?expanded="${(x, c) => c.parent.tableData[x.index]?.isExpanded}"
                                    :nestingLevel="${(x, c) => c.parent.tableData[x.index]?.nestingLevel}"
                                    :leafItemCount="${(x, c) => c.parent.tableData[x.index]?.leafItemCount}"
                                    :groupColumn="${(x, c) => c.parent.tableData[x.index]?.groupColumn}"
                                    ?selectable="${(_, c) => c.parent.selectionMode === TableRowSelectionMode.multiple}"
                                    selection-state="${(x, c) => c.parent.tableData[x.index]?.selectionState}"
                                    @group-selection-toggle="${async (x, c) => c.parent.onRowSelectionToggle(x.index, c.event as CustomEvent<TableRowSelectionToggleEventDetail>)}"
                                    @group-expand-toggle="${(x, c) => c.parent.handleGroupRowExpanded(x.index, c.event)}"
                                >
                                </${tableGroupRowTag}>
                            `)}
                            ${when((x, c) => !(c.parent as Table).tableData[x.index]?.isGrouped, html<VirtualItem, Table>`
                                <${tableRowTag}
                                    class="row"
                                    record-id="${(x, c) => c.parent.tableData[x.index]?.id}"
                                    ?selectable="${(_, c) => c.parent.selectionMode !== TableRowSelectionMode.none}"
                                    ?selected="${(x, c) => c.parent.tableData[x.index]?.selectionState === TableRowSelectionState.selected}"
                                    ?hide-selection="${(_, c) => c.parent.selectionMode !== TableRowSelectionMode.multiple}"
                                    :dataRecord="${(x, c) => c.parent.tableData[x.index]?.record}"
                                    :columns="${(_, c) => c.parent.columns}"
                                    :nestingLevel="${(x, c) => c.parent.tableData[x.index]?.nestingLevel}"
                                    @click="${async (x, c) => c.parent.onRowClick(x.index)}"
                                    @row-selection-toggle="${async (x, c) => c.parent.onRowSelectionToggle(x.index, c.event as CustomEvent<TableRowSelectionToggleEventDetail>)}"
                                    @row-action-menu-beforetoggle="${async (x, c) => c.parent.onRowActionMenuBeforeToggle(x.index, c.event as CustomEvent<TableActionMenuToggleEventDetail>)}"
                                    @row-action-menu-toggle="${async (_, c) => c.parent.onRowActionMenuToggle(c.event as CustomEvent<TableActionMenuToggleEventDetail>)}"
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
    </template>
`;
