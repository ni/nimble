/* eslint-disable @typescript-eslint/member-ordering */
import type { Table, View } from '@finos/perspective';
import type { IPerspectiveViewerPlugin } from '@finos/perspective-viewer';
import { observable, ViewTemplate } from '@microsoft/fast-element';
import { DesignSystem, FoundationElement, numberFieldTemplate } from '@microsoft/fast-foundation';

import { styles } from './styles';
import { template } from './template';

declare global {
    interface HTMLElementTagNameMap {
        'perspective-viewer-nimble-table': PerspectiveViewerNimbleTable;
    }
}

export interface TableRow {
    id: string;
    canExpand: boolean;
    isExpanded: boolean;
    children: TableRow[];
    data: { [key: string]: string | number | boolean | Date };
    isGroup: boolean;
    depth: number;
}

/**
 * A nimble-based perspctive plugin for a table
 */
export class PerspectiveViewerNimbleTable
    extends FoundationElement
    implements IPerspectiveViewerPlugin {
    public readonly name = 'NimbleTablePlugin';

    @observable
    public menuRowId = '';

    @observable
    public rows: TableRow[] = [];

    private readonly hierarchyDataField = 'parentId';
    private readonly idField = 'id';
    private readonly expandedRows = new Set<string>();

    public constructor() {
        super();
    }

    public override connectedCallback(): void {
        super.connectedCallback();

        this.addSlot('actionMenu', 'rowMenu');

        const ids = ['id-0', 'id-1', 'id-2', 'id-3', 'id-4', 'id-5', 'id-6', 'id-7', 'id-8', 'id-9'];
        for (const id of ids) {
            this.addSlot(`expandedRow-${id}`, `expandedRow-${id}`);
        }
    }

    private addSlot(name: string, slot: string): void {
        const slotElement = document.createElement('slot');
        slotElement.name = name;
        slotElement.slot = slot;
        this.appendChild(slotElement);
    }

    public onMenuOpening(row: TableRow): void {
        this.menuRowId = row.id;
    }

    // eslint-disable-next-line @typescript-eslint/class-literal-property-style, @typescript-eslint/naming-convention, camelcase
    public get select_mode(): 'select' | 'toggle' {
        return 'select';
    }

    // eslint-disable-next-line @typescript-eslint/naming-convention, camelcase
    public get min_config_columns(): number | undefined {
        return undefined;
    }

    // eslint-disable-next-line @typescript-eslint/naming-convention, camelcase
    public get config_column_names(): string[] | undefined {
        return undefined;
    }

    public async update(view: View): Promise<void> {
        return this.draw(view);
    }

    public async draw(view: View): Promise<void> {
        const viewConfig = await view.get_config();
        const groupByArray = viewConfig['group_by'] as string[];
        const groupByArrayLength = groupByArray.length;
        let viewToUse: View;
        if (groupByArrayLength && groupByArray[groupByArrayLength - 1] !== this.idField) {
            viewConfig['group_by'].push(this.idField);
            let aggregates = {};
            for (const group of groupByArray) {
                aggregates[group] = 'unique';
            }
            ////
            // TODO: add 'unique' for all columns that aren't sorted
            aggregates.x = 'unique';
            aggregates.y = 'unique';
            for (const sortPair of viewConfig['sort']) {
                if (sortPair[0] === 'x') {
                    if (sortPair[1] === 'asc') {
                        aggregates.x = 'low';
                    } else if (sortPair[1] === 'desc') {
                        aggregates.x = 'high';
                    }
                }
                if (sortPair[0] === 'y') {
                    if (sortPair[1] === 'asc') {
                        aggregates.y = 'low';
                    } else if (sortPair[1] === 'desc') {
                        aggregates.y = 'high';
                    }
                }
            }
            ////
            viewConfig['aggregates'] = aggregates;
            viewToUse = await this.getPerspectiveTable().view(viewConfig);
        } else {
            viewToUse = view;
        }

        if (this.hierarchyDataField && groupByArrayLength === 0) {
            await this.drawWithHierarchy(viewToUse);
        } else {
            const data = await viewToUse.to_json();
            const rows: TableRow[] = [];
            for (let i = 0; i < data.length; i++) {
                const d = data[i]!;
                if (d['__ROW_PATH__']?.length === 0) {
                    continue;
                }
                const depth = d['__ROW_PATH__'] ? d['__ROW_PATH__'].length : 0;

                const rowIsExpanded = await viewToUse.get_row_expanded(i) as boolean;
                const isGroup = depth < groupByArray.length;
                rows.push({
                    canExpand: isGroup,
                    isExpanded: rowIsExpanded,
                    children: [],
                    depth: depth,
                    data: d,
                    id: d[this.idField] as string,
                    isGroup: isGroup
                });
            }
            this.rows = rows;
        }
    }

    private getPerspectiveTable(): Table {
        return this.parentElement.getRootNode().host.table as Table;
    }

    private async drawWithHierarchy(view: View): Promise<void> {
        const viewConfig = await view.get_config();
        // Remove the filter from the view's configuration to ensure all items are returned, but
        // keep all other configuration so that the order of the items is correct.
        viewConfig.filter = [];
        const completeView = await this.getPerspectiveTable().view(viewConfig);
        const allData = await completeView.to_json();
        const allRowsAsTree = this.populateData(allData, '');
        const viewData = await view.to_json();
        this.rows = this.removeFilteredOutRows(allRowsAsTree, viewData);
    }

    private removeFilteredOutRows(allRowsAsTree: TableRow[], viewData: Record<string, string | number | boolean | Date>[]): TableRow[] {
        const newRows = [];
        for (const row of allRowsAsTree) {
            const updatedChildren = this.removeFilteredOutRows(row.children, viewData);
            row.children = updatedChildren;
            row.canExpand = updatedChildren.length > 0;
            if (updatedChildren.length) {
                newRows.push(row);
            } else {
                const isInFilteredView = viewData.some(x => x[this.idField] as string === row.id);
                if (isInFilteredView) {
                    newRows.push(row);
                }
            }
        }

        return newRows;
    }

    private populateData(allData: { [key: string]: string | number | boolean | Date }[], parentId: string): TableRow[] {
        const d = this.getItemsWithParent(allData, parentId);
        const rows: TableRow[] = [];
        for (const item of d) {
            const childRows = this.populateData(allData, item[this.idField] as string);

            const rowId = item[this.idField] as string;
            rows.push({
                canExpand: childRows.length > 0,
                isExpanded: this.expandedRows.has(rowId),
                children: childRows,
                data: item,
                id: rowId,
                isGroup: false,
                depth: 0
            });
        }

        return rows;
    }

    public toggleRowExpansionState(row: TableRow): void {
        row.isExpanded = !row.isExpanded;
        if (row.isExpanded) {
            this.expandedRows.add(row.id);
        } else {
            this.expandedRows.delete(row.id);
        }

        this.rows = JSON.parse(JSON.stringify(this.rows));
    }

    private getItemsWithParent(allData: { [key: string]: string | number | boolean | Date }[], parentId: string): { [key: string]: string | number | boolean | Date }[] {
        return allData.filter(x => x[this.hierarchyDataField] === parentId);
    }

    public async clear(): Promise<void> {
        this.content = '';
    }

    public async resize(): Promise<void> {
        // Not Implemented
    }

    public async restyle(): Promise<void> {
        // Not Implemented
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public async save(): Promise<any> {
        // Not Implemented
    }

    public async restore(): Promise<void> {
        // Not Implemented
    }

    public async delete(): Promise<void> {
        // Not Implemented
    }
}

const perspectiveViewerNimbleTable = PerspectiveViewerNimbleTable.compose({
    baseName: 'perspective-viewer-nimble-table',
    template,
    styles
});

DesignSystem.getOrCreate()
    .withPrefix('nimble')
    .register(perspectiveViewerNimbleTable());

void (async () => {
    await customElements.whenDefined('perspective-viewer');
    const viewerClass = customElements.get('perspective-viewer');
    const promise = viewerClass.registerPlugin(
        'nimble-perspective-viewer-nimble-table'
    );
    // eslint-disable-next-line @typescript-eslint/no-confusing-void-expression
    const result = await promise;
    return result;
})();

