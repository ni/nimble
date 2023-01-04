import { ElementsFilter, html, repeat, slotted, when } from '@microsoft/fast-element';
import { DesignSystem } from '@microsoft/fast-foundation';
import type { RowXYZ, Table } from '.';
import { TableHeader } from './components/header';
import { TableRow } from './components/row';
import { TableColumn } from './components/column/table-column';

const isTableColumn = (): ElementsFilter => {
    const filter: ElementsFilter = (value: Node, _: number, __: Node[]): boolean => {
        return (value instanceof TableColumn);
    };
    return filter;
};

const getColumnHeader = (column: TableColumn): string | undefined => {
    const textContent = column.textContent;
    return (textContent !== '' && textContent ? textContent : column.getRecordFieldNames()[0]);
};

// prettier-ignore
export const template = html<Table>`
    <template role="table">
        <div class="table-container">
            <div role="rowgroup">
                <div class="header-row" role="row">
                    ${repeat(x => x.columns, html<TableColumn>`
                        <${DesignSystem.tagFor(TableHeader)} class="header">
                            ${x => getColumnHeader(x)}
                        </${DesignSystem.tagFor(TableHeader)}>
                    `)}
                </div>
            </div>
            <div class="table-viewport" role="rowgroup">
               ${when(x => x.columns.length > 0, html<Table>`
                    ${repeat(x => x.tableData, html<RowXYZ>`
                        <${DesignSystem.tagFor(TableRow)}
                            row-id="${x => x.id}"
                            :data="${x => x.data}"
                            :columns="${(_, c) => (c.parent as Table).columns}"
                            @row-action-menu-opening="${(_, c) => (c.parent as Table).onRowActionMenuOpening(c.event as CustomEvent)}"
                        >
                        <slot name="${(x, c) => (((c.parent as Table).openActionMenuRowId === x.id) ? 'actionMenu' : 'unused_actionMenu')}" slot="rowActionMenu"></slot>
                        </${DesignSystem.tagFor(TableRow)}>
                    `)}
                `)}
            </div>
        </div>
        <slot ${slotted({ property: 'slottedColumns', filter: isTableColumn() })}></slot>
    </template>
`;
