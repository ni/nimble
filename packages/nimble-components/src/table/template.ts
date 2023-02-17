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

// prettier-ignore
export const template = html<Table>`
    <template role="table" ${children({ property: 'childItems', filter: elements() })}>
        <div class="table-container">
            <div role="rowgroup" class="header-container">
                <div class="header-row" role="row" style="grid-template-columns: ${x => x.rowGridColumns} auto; left: -${x => x.scrollX}px;">
                    ${repeat(x => x.columns, html<TableColumn>`
                        <${DesignSystem.tagFor(TableHeader)} class="header">
                            <slot name="${x => x.slot}"></slot>
                        </${DesignSystem.tagFor(TableHeader)}>
                    `)}
                    <div class="header-scrollbar-spacer" style="width: ${x => (x.virtualizer.headerContainerMarginRight !== 0 ? '17' : '0')}px;"></div>
                </div>
            </div>
            <div class="table-viewport" ${ref('viewport')}>
                <div class="table-scroll" style="height: ${x => x.virtualizer.allRowsHeight}px;"></div>
                <div class="table-row-container" role="rowgroup" style="transform: ${x => (x.virtualizer.rowContainerYOffset === 0 ? 'none' : `translateY(${x.virtualizer.rowContainerYOffset}px)`)};">
                    ${when(x => x.columns.length > 0 && x.canRenderRows, html<Table>`
                        ${repeat(x => x.virtualizer.visibleItems, html<VirtualItem, Table>`
                            <${DesignSystem.tagFor(TableRow)}
                                class="row"
                                record-id="${(x, c) => c.parent.tableData[x.index]?.id}"
                                :dataRecord="${(x, c) => c.parent.tableData[x.index]?.record}"
                                :columns="${(_, c) => c.parent.columns}"
                                :rowGridColumns="${(_, c) => c.parent.rowGridColumns}"
                            >
                            </${DesignSystem.tagFor(TableRow)}>
                        `)}
                    `)}
                </div>
            </div>
        </div>
    </template>
`;
