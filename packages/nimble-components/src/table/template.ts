import { html, repeat, ref } from '@microsoft/fast-element';
import { DesignSystem } from '@microsoft/fast-foundation';
import type { VirtualItem } from '@tanstack/virtual-core';
import type { Table } from '.';
import { TableHeader } from './components/header';
import { TableRow } from './components/row';

// prettier-ignore
export const template = html<Table>`
    <template role="table">
        <div class="table-container">
            <div role="rowgroup" class="header-container" ${ref('headerContainer')} style="margin-right: ${x => x.headerContainerMarginRight}px;">
                <div class="header-row" role="row">
                    ${repeat(x => x.columnHeaders, html<string>`
                        <${DesignSystem.tagFor(TableHeader)} class="header">
                            ${x => x}
                        </${DesignSystem.tagFor(TableHeader)}>
                    `)}
                </div>
            </div>
            <div class="table-viewport" role="rowgroup" ${ref('viewport')}>
                <div class="table-scroll" style="height: ${x => x.rowContainerHeight}px;"></div>
                <div class="table-row-container" ${ref('rowContainer')}>
                    ${repeat(x => x.visibleItems, html<VirtualItem>`
                        <${DesignSystem.tagFor(TableRow)}
                            :data="${(x, c) => (c.parent as Table).data[x.index]}"
                            :columns="${(_, c) => (c.parent as Table).columns}"
                            style="height: ${x => x.size}px;"
                        >
                        </${DesignSystem.tagFor(TableRow)}>
                    `)}
                </div>
            </div>
        </div>
    </template>
`;
