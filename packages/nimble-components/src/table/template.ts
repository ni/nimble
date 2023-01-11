import { html, repeat } from '@microsoft/fast-element';
import { DesignSystem } from '@microsoft/fast-foundation';
import type { Table } from '.';
import type { TableRecord } from './types';
import { TableHeader } from './components/header';
import { TableRow } from './components/row';

// prettier-ignore
export const template = html<Table>`
    <template role="table">
        <div class="table-container">
            <div role="rowgroup" class="header-container">
                <div class="header-row" role="row">
                    ${repeat(x => x.columnHeaders, html<string>`
                        <${DesignSystem.tagFor(TableHeader)} class="header">
                            ${x => x}
                        </${DesignSystem.tagFor(TableHeader)}>
                    `)}
                </div>
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
