import { DesignSystem, FoundationElement } from '@microsoft/fast-foundation';
import { observable } from '@microsoft/fast-element';
import perspective from '@finos/perspective';
import type { Table as PerspectiveTable } from '@finos/perspective';
import type { HTMLPerspectiveViewerElement } from '@finos/perspective-viewer';
import { styles } from './styles';
import { template } from './template';
import '@finos/perspective-viewer';
import 'regular-table';
import { tableFont } from './table-theme';
import { HTMLPerspectiveViewerDatagridPluginElement } from '../perspective-viewer-datagrid/src/js/custom_elements/datagrid';
import '../perspective-viewer-nimble-table';
import type { IColumnProvider } from '../table-column-providers/column-provider';
import type { TableColumn } from '../table-column/table-column';
import type { PerspectiveViewerNimbleTable } from '../perspective-viewer-nimble-table';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-table': Table;
    }
}

// Install the google font
document.head.insertAdjacentHTML(
    'beforeend',
    `
<style>
    ${tableFont}
</style>
`
);

interface ObjectInterface {
    [key: string]: unknown;
}

/**
 * A nimble-styled container for toolbar content next to tabs.
 */
export class Table extends FoundationElement {
    public readonly viewer!: HTMLPerspectiveViewerElement;

    @observable
    public slottedColumns: IColumnProvider[] = [];

    private readonly worker = perspective.worker();
    private table?: PerspectiveTable;

    public override connectedCallback(): void {
        super.connectedCallback();
        void (async () => {
            this.table = await this.worker.table({
                x: 'float',
                y: 'float',
                z: 'float'
            });
            await this.viewer.load(this.table);
            const columnData = [...Array(2000).keys()];
            const data = {
                x: columnData,
                y: columnData,
                z: columnData
            };
            this.table.update(data);
            await this.viewer.toggleConfig(true);
            // theme needs to be manually reset as the autodetection
            // of styles won't work
            await this.viewer.resetThemes(['Material Light']);
            this.initializeColumns();
        })();
    }

    private slottedColumnsChanged(): void {
        if (this.$fastController.isConnected) {
            this.initializeColumns();
        }
    }

    private initializeColumns(): void {
        if (this.slottedColumns.length > 0) {
            const columns: TableColumn[] = [];
            for (const columnProvider of this.slottedColumns) {
                if (this.isColumnProvider(columnProvider)) {
                    const tableColumn = { columnDataKey: columnProvider.columnId, title: columnProvider.columnTitle, cellTemplate: columnProvider.getColumnTemplate() } as TableColumn;
                    columns.push(tableColumn);
                }
            }
            if (this.table) {
                void (async () => {
                    await this.viewer!.restore({ columns: columns.map(c => c.columnDataKey) });
                })();
            }
        }
    }

    private isColumnProvider(object: unknown): boolean {
        return 'columnId' in (object as ObjectInterface) && 'getColumnTemplate' in (object as ObjectInterface);
    }
}

const nimbleTable = Table.compose({
    baseName: 'table',
    template,
    styles
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleTable());

// Inlined registration from perspective-viewer-datagrid\src\js\index.js
customElements.define(
    'perspective-viewer-datagrid',
    HTMLPerspectiveViewerDatagridPluginElement
);

void customElements.whenDefined('perspective-viewer').then(async () => {
    return customElements
        .get('perspective-viewer')
        .registerPlugin('perspective-viewer-datagrid');
});
