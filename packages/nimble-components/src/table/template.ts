import {
    children,
    elements,
    html,
    ref,
    repeat,
    when
} from '@microsoft/fast-element';
import { DesignSystem } from '@microsoft/fast-foundation';
import type { VirtualItem } from '@tanstack/virtual-core';
import type { Table } from '.';
import { TableHeader } from './components/header';
import { TableRow } from './components/row';
import type { TableColumn } from '../table-column/base';
import type { TableActionMenuToggleEventDetail } from './types';

// prettier-ignore
export const template = html<Table>`
    <template role="table" ${children({ property: 'childItems', filter: elements() })}>
        <div class="table-container">
            <div role="rowgroup" class="header-container">
                <div class="header-row" role="row">
                    ${repeat(x => x.columns, html<TableColumn>`
                        ${when(x => !x.columnHidden, html<TableColumn>`
                            <${DesignSystem.tagFor(TableHeader)} class="header">
                                <slot name="${x => x.slot}"></slot>
                            </${DesignSystem.tagFor(TableHeader)}>
                        `)}
                    `)}
                    <div class="header-scrollbar-spacer" style="width: ${x => x.virtualizer.headerContainerMarginRight}px;"></div>
                </div>
            </div>
            <div class="table-viewport" ${ref('viewport')}>
                <div class="table-scroll" style="height: ${x => x.virtualizer.allRowsHeight}px;"></div>
                <div class="table-row-container" role="rowgroup" style="top: ${x => `${x.virtualizer.rowContainerYOffset}px;`}">
                    ${when(x => x.columns.length > 0 && x.canRenderRows, html<Table>`
                        ${repeat(x => x.virtualizer.visibleItems, html<VirtualItem, Table>`
                            <${DesignSystem.tagFor(TableRow)}
                                class="row"
                                record-id="${(x, c) => c.parent.tableData[x.index]?.id}"
                                :dataRecord="${(x, c) => c.parent.tableData[x.index]?.record}"
                                :columns="${(_, c) => c.parent.columns}"
                                @row-action-menu-beforetoggle="${(_, c) => c.parent.onRowActionMenuBeforeToggle(c.event as CustomEvent<TableActionMenuToggleEventDetail>)}"
                                @row-action-menu-toggle="${(_, c) => c.parent.onRowActionMenuToggle(c.event as CustomEvent<TableActionMenuToggleEventDetail>)}"
                                style="height: ${x => x.size}px;"
                            >
                            ${when((x, c) => (c.parent as Table).openActionMenuRecordId === (c.parent as Table).tableData[x.index]?.id, html<VirtualItem, Table>`
                                ${repeat((_, c) => (c.parent as Table).actionMenuSlots, html<string, Table>`
                                    <slot
                                        name="${x => x}"
                                        slot="${x => `row-action-menu-${x}`}">
                                    </slot>
                                `)}
                            `)}                        
                            </${DesignSystem.tagFor(TableRow)}>
                        `)}
                    `)}
                </div>
            </div>
        </div>
    </template>
`;
