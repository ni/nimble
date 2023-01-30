import {
    children,
    ElementsFilter,
    html,
    repeat,
    when
} from '@microsoft/fast-element';
import { DesignSystem } from '@microsoft/fast-foundation';
import type { Table } from '.';
import type { TableRowState } from './types';
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
    <template role="table" ${children({ property: 'columns', filter: isTableColumn() })}>
        <div class="table-container">
            <div role="rowgroup" class="header-container">
                <div class="header-row" role="row">
                    ${repeat(x => x.columns, html<TableColumn>`
                        <${DesignSystem.tagFor(TableHeader)} 
                            class="header">
                            <slot name="${x => x.slot}"></slot>
                        </${DesignSystem.tagFor(TableHeader)}>
                    `)}
                </div>
            </div>
            <div class="table-viewport" role="rowgroup">
            ${when(x => x.columns.length > 0 && x.canRenderRows, html<Table>`
                ${repeat(x => x.tableData, html<TableRowState>`
                    <${DesignSystem.tagFor(TableRow)}
                        class="row"
                        record-id="${x => x.id}"
                        :dataRecord="${x => x.record}"
                        :columns="${(_, c) => (c.parent as Table).columns}"
                    >
                    </${DesignSystem.tagFor(TableRow)}>
                `)}
            `)}
            </div>
        </div>
        <slot></slot>
    </template>
`;
