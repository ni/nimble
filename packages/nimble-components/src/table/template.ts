import {
    ElementsFilter,
    html,
    ref,
    repeat,
    slotted,
    when
} from '@microsoft/fast-element';
import { DesignSystem } from '@microsoft/fast-foundation';
import type { VirtualItem } from '@tanstack/virtual-core';
import type { Table } from '.';
import { TableHeader } from './components/header';
import { TableRow } from './components/row';
import { TableColumn } from '../table-column/base';

const isTableColumn = (): ElementsFilter => {
    const filter: ElementsFilter = (
        value: Node,
        _: number,
        __: Node[]
    ): boolean => {
        return value instanceof TableColumn;
    };
    return filter;
};

// prettier-ignore
export const template = html<Table>`
    <template role="table">
        <div class="table-container">
            <div role="rowgroup" class="header-container" ${ref('headerContainer')} style="margin-right: ${x => x.headerContainerMarginRight}px;">
                <div class="header-row" role="row">
                    ${repeat(x => x.columns, html<TableColumn>`
                        <${DesignSystem.tagFor(TableHeader)} class="header">
                            ${x => x.textContent}
                        </${DesignSystem.tagFor(TableHeader)}>
                    `)}
                </div>
            </div>
            <div class="table-viewport" ${ref('viewport')}>
                <div class="table-scroll" style="height: ${x => x.allRowsHeight}px;"></div>
                <div class="table-row-container" role="rowgroup" ${ref('rowContainer')}>
                    ${when(x => x.columns.length > 0, html<Table>`
                        ${repeat(x => x.visibleItems, html<VirtualItem>`
                            <${DesignSystem.tagFor(TableRow)}
                                :dataRecord="${(x, c) => (c.parent as Table).tableData[x.index]?.record}"
                                :columns="${(_, c) => (c.parent as Table).columns}"
                                style="height: ${x => x.size}px;"
                            >
                            </${DesignSystem.tagFor(TableRow)}>
                        `)}
                    `)}
                </div>
            </div>
        </div>
        <slot ${slotted({ property: 'columns', filter: isTableColumn() })}></slot>
    </template>
`;
