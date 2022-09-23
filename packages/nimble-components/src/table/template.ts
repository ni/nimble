import { html, when, repeat } from '@microsoft/fast-element';
import type { Cell } from '@tanstack/table-core';
import type { Table, TableHeader, TableRow } from '.';

export const template = html<Table>`
${when(
        x => x.ready,
        html<Table>`
        <template>
            <table>
                <slot slot="column-cell-templates"></slot>
                <thead>
                    <tr>
                    ${repeat(x => x.tableHeaders, html<TableHeader>`
                        <th>
                            <nimble-button appearance="ghost" @click=${x => { x.column.toggleSorting(); }}>
                                ${when(x => x.column.getIsSorted() === 'asc', html`
                                    <nimble-icon-arrow-expander-up slot="end"></nimble-icon-arrow-expander-up>
                                `)}
                                ${when(x => x.column.getIsSorted() === 'desc', html`
                                    <nimble-icon-arrow-expander-down slot="end"></nimble-icon-arrow-expander-down>
                                `)}
                                <span>${x => x.title}</span>
                            </nimble-button>
                        </th>
                    `, { positioning: true })}
                    </tr>
                </thead>
                <tbody>
                ${repeat(x => x.tableRows, html<TableRow>`
                    <tr>
                        ${repeat(x => x.row.getVisibleCells(), html<Cell<unknown, unknown>>`
                            <td>
                                <nimble-table-cell 
                                    :cellItemTemplate=${(_, c) => (c.parentContext.parent as Table)!.getColumnTemplate(c.index)}
                                    :cellData=${x => x.getValue()} 
                                    >
                                </nimble-table-cell>
                            </td>
                        `, { positioning: true })}
                    `)}
                    </tr>
                </tbody>
            </table>
        </template>
    `
    )}`;
