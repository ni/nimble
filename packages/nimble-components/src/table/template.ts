import { html, repeat } from '@microsoft/fast-element';
import type { Table } from '.';

// prettier-ignore
export const template = html<Table>`
    <template>
        <div class="table-container">
            <div class="table-header">
                ${repeat(x => x.getColumnHeaders(), html<string>`
                    <span class="table-cell">${x => x}</span>
                `)}
            </div>
            <div class="table-viewport">
                ${repeat(x => x.tableData, html<string[]>`
                    <div class="table-row">
                        ${repeat(x => x, html<string>`
                            <span class="table-cell">${x => x}</span>
                        `)}
                    </div>
                `)}
            </div>
        </div>
    </template>
`;
