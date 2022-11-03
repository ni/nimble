import { html, repeat, ViewTemplate, when } from '@microsoft/fast-element';
import type { PerspectiveViewerNimbleTable, TableRow } from '.';

function getRowTemplate(table: PerspectiveViewerNimbleTable, row: TableRow, recursiveDepth: number): ViewTemplate {
    const depth = row.depth || recursiveDepth;
    let leftMargin = depth * 20;
    if (!row.canExpand) {
        leftMargin += 36;
    }

    return html`
        <div style="margin-left: ${_ => leftMargin}px">
            ${when(_ => row.canExpand, html`
                <nimble-button
                    content-hidden
                    @click=${_ => table.toggleRowExpansionState(row)}
                >
                    ${when(_ => row.isExpanded, html`
                        <nimble-icon-arrow-expander-down slot="start">
                    `)}
                    ${when(_ => !row.isExpanded, html`
                        <nimble-icon-arrow-expander-right slot="start">
                    `)}
                </nimble-button>
            `)}
            ${when(_ => row.isGroup, html`
                <span>This is a group</span>
            `)}
            ${when(_ => !row.isGroup, html`
                <span>${_ => row.data['x']}</span>
                <span>${_ => row.data['y']}</span>
                <span>${_ => row.data['age']}</span>
                <nimble-menu-button
                    content-hidden
                    appearance="ghost"
                    @opening="${_ => table.onMenuOpening(row)}"
                >
                    <nimble-icon-three-dots-line slot="start"></nimble-icon-three-dots-line>
                    ${when(_ => table.menuRowId === row.id, html`
                        <slot name="rowMenu" slot="menu"></slot>
                    `)}
                </nimble-menu-button>
            `)}
        </div>
        ${when(_ => row.isExpanded, html`
            ${repeat(_ => row.children, html<TableRow>`
                ${x => getRowTemplate(table, x, recursiveDepth + 1)}
            `)}
        `)}
    `;
}

export const template = html<PerspectiveViewerNimbleTable>`
    <span>X | Y | Age</span>
    ${repeat(x => x.rows, html<TableRow>`
        ${(x, c) => getRowTemplate(c.parent as PerspectiveViewerNimbleTable, x, 0)}
    `)}
`;
