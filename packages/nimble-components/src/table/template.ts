import { html, repeat } from '@microsoft/fast-element';
import { DesignSystem } from '@microsoft/fast-foundation';
import type { Table } from '.';
import type { TableRecord } from './types';
import { TableRow } from './row';

// prettier-ignore
export const template = html<Table>`
    <template role="table">
        <div class="table-container">
            <div class="table-header" role="row">
                ${repeat(x => x.columnHeaders, html<string>`
                    <span class="table-cell" role="columnheader">${x => x}</span>
                `)}
            </div>
            <div class="table-viewport" role="rowgroup">
                ${repeat(x => x.data, html<TableRecord>`
                    <${DesignSystem.tagFor(TableRow)}
                        :data="${x => x}"
                        :columns="${(_, c) => (c.parent as Table).columns}"
                    >
                    </${DesignSystem.tagFor(TableRow)}>
                `)}
            </div>
        </div>
    </template>
`;
