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
    TableRowSelectionState
} from './types';
import { tableGroupRowTag } from './components/group-row';

// prettier-ignore
export const template = html<Table>`
    <template
        role="grid"
        ${children({ property: 'childItems', filter: elements() })}>
        <div class="table-container" style="
            --ni-private-table-scroll-x: -${x => x.scrollX}px;
            --ni-private-table-header-scrollbar-spacer-width: ${x => x.virtualizer.headerContainerMarginRight}px;
            --ni-private-table-scroll-height: ${x => x.virtualizer.allRowsHeight}px;
            --ni-private-table-row-container-top: ${x => x.virtualizer.rowContainerYOffset}px; 
            --ni-private-table-row-grid-columns: ${x => x.rowGridColumns ?? ''};
            --ni-private-table-cursor-override: ${x => (x.isColumnBeingSized ? 'col-resize' : 'default')};
            --ni-private-table-total-width: ${x => x.tableWidthFactor * 100}%;
            ">
            <div role="rowgroup" class="header-row-container">
                <div class="header-row" ${ref('rowHeader')} role="row">
                    ${repeat(x => x.columns, html<TableColumn>`
                        ${when(x => !x.columnHidden, html<TableColumn, Table>`
                            <div class="header-container">
                                ${when((_, c) => c.index > 0, html<TableColumn, Table>`
                                    <div class="column-divider left" @mousedown="${(_, c) => c.parent.onLeftDividerMouseDown(c.index)}"></div>
                                `)}
                                    <${tableHeaderTag}
                                        class="header"
                                        sort-direction="${x => (typeof x.sortIndex === 'number' ? x.sortDirection : TableColumnSortDirection.none)}"
                                        ?first-sorted-column="${(x, c) => x === c.parent.firstSortedColumn}"
                                    >
                                        <slot name="${x => x.slot}"></slot>
                                    </${tableHeaderTag}>
                                <div class="column-divider right" @mousedown="${(_, c) => c.parent.onRightDividerMouseDown(c.index)}"></div>
                            </div>
                        `)}
                    `, { positioning: true })}
                    <div class="header-scrollbar-spacer"></div>
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
                                    :dataRecord="${(x, c) => c.parent.tableData[x.index]?.record}"
                                    :columns="${(_, c) => c.parent.columns}"
                                    :nestingLevel="${(x, c) => c.parent.tableData[x.index]?.nestingLevel}"
                                    @click="${async (x, c) => c.parent.onRowClick(x.index)}"
                                    @row-action-menu-beforetoggle="${(_, c) => c.parent.onRowActionMenuBeforeToggle(c.event as CustomEvent<TableActionMenuToggleEventDetail>)}"
                                    @row-action-menu-toggle="${(_, c) => c.parent.onRowActionMenuToggle(c.event as CustomEvent<TableActionMenuToggleEventDetail>)}"
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
