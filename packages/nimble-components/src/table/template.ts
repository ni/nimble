import { html, when, repeat, ViewTemplate, ref } from '@microsoft/fast-element';
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
                <nimble-button appearance="ghost" @click=${x => { x.column.toggleSorting(); }}>
                    ${when(x => x.column.getIsSorted() === 'asc', html`
                        <nimble-icon-arrow-expander-up slot="end"></nimble-icon-arrow-expander-up>
                    `)}
                    ${when(x => x.column.getIsSorted() === 'desc', html`
                        <nimble-icon-arrow-expander-down slot="end"></nimble-icon-arrow-expander-down>
                    `)}
                    <span>${x => x.title}</span>
                </nimble-button>
            `, { positioning: true })}
        </div>
        <div class="table-viewport" ${ref('viewport')}>
            <div class="table-body" ${ref('rowContainer')} style="height: ${x => x.rowContainerHeight}px">
                ${repeat(x => x.visibleItems, html<VirtualItem<TableRow>>`
                    <${context.tagFor(TableRow)}
                        :rowData="${(x, c) => (c.parent as Table).tableData[x.index]}"
                        style="
                            height: ${x => x.size}px;
                            position: absolute;
                            width: 100%;
                            transform: translateY(${x => x.start}px);
                            ">
                    </${context.tagFor(TableRow)}>
                    `)}
            </div>
        </div>
    </div>
</template>
`;
