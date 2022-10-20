import { html, when, repeat, ViewTemplate, ref, slotted, elements } from '@microsoft/fast-element';
import type { FoundationElementTemplate } from '@microsoft/fast-foundation';
import type { VirtualItem } from '@tanstack/virtual-core';
import type { Table, TableHeader } from '.';
import { TableRow } from '../table-row';

// export const template = html<Table>`
// ${when(
//         x => x.ready,
//         html<Table>`
//         <template>
//             <table>
//                 <slot slot="column-cell-templates"></slot>
//                 <thead>
//                     <tr>
//                     ${repeat(x => x.tableHeaders, html<TableHeader>`
//                         <th>
//                             <nimble-button appearance="ghost" @click=${x => { x.column.toggleSorting(); }}>
//                                 ${when(x => x.column.getIsSorted() === 'asc', html`
//                                     <nimble-icon-arrow-expander-up slot="end"></nimble-icon-arrow-expander-up>
//                                 `)}
//                                 ${when(x => x.column.getIsSorted() === 'desc', html`
//                                     <nimble-icon-arrow-expander-down slot="end"></nimble-icon-arrow-expander-down>
//                                 `)}
//                                 <span>${x => x.title}</span>
//                             </nimble-button>
//                         </th>
//                     `, { positioning: true })}
//                     </tr>
//                 </thead>
//                 <tbody>
//                 ${repeat(x => x.tableRows, html<TableRow>`
//                     <tr>
//                         ${repeat(x => x.row.getVisibleCells(), html<Cell<unknown, unknown>>`
//                             <td>
//                                 <nimble-table-cell 
//                                     :cellItemTemplate=${(_, c) => (c.parentContext.parent as Table)!.getColumnTemplate(c.index)}
//                                     :cellData=${x => x.getValue()} 
//                                     >
//                                 </nimble-table-cell>
//                             </td>
//                         `, { positioning: true })}
//                     `)}
//                     </tr>
//                 </tbody>
//             </table>
//         </template>
//     `
//     )}`;
export const template: FoundationElementTemplate<ViewTemplate<Table>> = context => html<Table>`
<template>
    <div class="table-container" ${ref('tableContainer')}>
        <div class="table-header"> 
            ${repeat(x => x.tableHeaders, html<TableHeader>`
                <nimble-menu-button appearance="ghost">
                    ${when(x => x.column.getIsSorted() === 'asc', html`
                        <nimble-icon-arrow-expander-up slot="end"></nimble-icon-arrow-expander-up>
                    `)}
                    ${when(x => x.column.getIsSorted() === 'desc', html`
                        <nimble-icon-arrow-expander-down slot="end"></nimble-icon-arrow-expander-down>
                    `)}
                    <span>${x => x.title}</span>

                    <nimble-menu slot="menu">
                        <nimble-menu-item @change=${x => { x.column.toggleSorting(); }}>Toggle sorting</nimble-menu-item>
                        <nimble-menu-item @change=${x => { x.column.toggleGrouping(); }}>Toggle grouping</nimble-menu-item>
                    </nimble-menu>
                </nimble-menu-button>
            `, { positioning: true })}
        </div>
        <div class="table-viewport" ${ref('viewport')}>
            <div class="table-body" ${ref('rowContainer')} style="height: ${x => x.rowContainerHeight}px">
                ${repeat(x => x.visibleItems, html<VirtualItem<TableRow>>`
                    ${when((x, c) => (c.parent as Table).tableData[x.index]?.row.getIsGrouped(), html<VirtualItem<TableRow>>`
                        <span class="group-row-content"
                            style="
                                height: ${x => x.size}px;
                                position: absolute;
                                width: calc(100% - ${(x, c) => 16 * ((c.parent as Table).tableData[x.index]?.row.depth || 0)}px);
                                margin-top: ${x => x.start}px;
                                padding-left: ${(x, c) => 16 * ((c.parent as Table).tableData[x.index]?.row.depth || 0)}px;
                                ">
                            <nimble-button
                                appearance="ghost"
                                content-hidden
                                @click=${(x, c) => (c.parent as Table).tableData[x.index]?.row.toggleExpanded()}>
                                ${when((x, c) => (c.parent as Table).tableData[x.index]?.row.getIsExpanded(), html`
                                    <nimble-icon-arrow-expander-down slot="start"></nimble-icon-arrow-expander-down>
                                `)}
                                ${when((x, c) => !(c.parent as Table).tableData[x.index]?.row.getIsExpanded(), html`
                                    <nimble-icon-arrow-expander-right slot="start"></nimble-icon-arrow-expander-right>
                                `)}
                                Expand/Collapse
                            </nimble-button>
                            <!-- TODO: 'subrows' doesn't correctly account for sub groups. -->
                            <span class="group-text">
                                ${(x, c) => (c.parent as Table).tableData[x.index]?.row.groupingValue} (${(x, c) => (c.parent as Table).tableData[x.index]?.row.subRows.length})
                            </span>
                        </span>
                    `)}
                    ${when((x, c) => !(c.parent as Table).tableData[x.index]?.row.getIsGrouped(), html<VirtualItem<TableRow>>`
                        <span id=${(x, c) => `row-${(c.parent as Table).tableData[x.index]?.row.id || ''}`} class="foo"
                                style="
                                    position: absolute;
                                    width: calc(100% - ${(x, c) => 16 * ((c.parent as Table).tableData[x.index]?.row?.depth || 0)}px);
                                    margin-top: ${x => x.start}px;
                                    padding-left: ${(x, c) => 16 * ((c.parent as Table).tableData[x.index]?.row?.depth || 0)}px;
                                    ">
                            <span class="group-row-content" style="height: 32px">
                                ${when((x, c) => (c.parent as Table).tableData[x.index]?.row.getCanExpand(), html<VirtualItem<TableRow>>`
                                    <nimble-button
                                        appearance="ghost"
                                        content-hidden
                                        @click=${(x, c) => (c.parent as Table).tableData[x.index]?.row.toggleExpanded()}>
                                        ${when((x, c) => (c.parent as Table).tableData[x.index]?.row.getIsExpanded(), html`
                                            <nimble-icon-arrow-expander-down slot="start"></nimble-icon-arrow-expander-down>
                                        `)}
                                        ${when((x, c) => !(c.parent as Table).tableData[x.index]?.row.getIsExpanded(), html`
                                            <nimble-icon-arrow-expander-right slot="start"></nimble-icon-arrow-expander-right>
                                        `)}
                                        Expand/Collapse
                                    </nimble-button>
                                `)}
                                <${context.tagFor(TableRow)} :rowData="${(x, c) => (c.parent as Table).tableData[x.index]}">
                                    <slot name="${(x, c) => ((c.parent as Table).isActiveRow(x.index) ? 'actionMenu' : 'zzz')}" slot="rowActionMenu"></slot>
                                </${context.tagFor(TableRow)}>                                
                            </span>
                            ${when((x, c) => (c.parent as Table).tableData[x.index]?.row.getIsExpanded(), html<VirtualItem<TableRow>>`
                                <slot
                                    name="${(x, c) => `expandedRow-${(c.parent as Table).tableData[x.index]?.row.id || ''}`}" 
                                    @slotchange=${(_, c) => (c.parent as Table).onExpandedRowSlotChange()}>
                                </slot>
                            `)}
                        </span>
                    `)}
                `)}
            </div>
        </div>
    </div>
</template>
`;
