import { observable } from '@microsoft/fast-element';
import { DesignSystem, FoundationElement } from '@microsoft/fast-foundation';
import {
    ColumnDef as TanStackColumnDef,
    TableState as TanStackTableState,
    Updater as TanStackUpdater,
    Table as TanStackTable,
    createTable as tanStackCreateTable,
    getCoreRowModel as tanStackGetCoreRowModel,
    TableOptionsResolved as TanStackTableOptionsResolved
} from '@tanstack/table-core';
import type { TableColumn } from './components/column/table-column';
import { styles } from './styles';
import { template } from './template';
import type { TableRecord } from './types';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-table': Table;
    }
}

/**
 * A nimble-styled table.
 */
export class Table<
    TData extends TableRecord = TableRecord
> extends FoundationElement {
    @observable
    public data: TData[] = [];

    @observable
    public readonly slottedColumns: TableColumn[] = [];

    /**
     * @internal
     */
    @observable
    public columns: TableColumn[] = [];

    private readonly table: TanStackTable<TData>;
    private options: TanStackTableOptionsResolved<TData>;
    private readonly tableInitialized: boolean = false;

    public constructor() {
        super();
        this.options = {
            data: [],
            onStateChange: (_: TanStackUpdater<TanStackTableState>) => {},
            getCoreRowModel: tanStackGetCoreRowModel(),
            columns: [],
            state: {},
            renderFallbackValue: null,
            autoResetAll: false
        };
        this.table = tanStackCreateTable(this.options);
        this.tableInitialized = true;
    }

    public dataChanged(
        prev: TData[] | undefined,
        next: TData[] | undefined
    ): void {
        if ((!prev || prev.length === 0) && next && next.length > 0) {
            this.generateColumns();
        }

        // Ignore any updates that occur prior to the TanStack table being initialized.
        if (this.tableInitialized) {
            this.updateTableOptions({ data: this.data });
        }
    }

    private slottedColumnsChanged(): void {
        if (this.$fastController.isConnected) {
            this.initializeColumns();
        }
    }

    private initializeColumns(): void {
        if (this.slottedColumns.length > 0) {
            const columns: TableColumn[] = [];
            for (const column of this.slottedColumns) {
                columns.push(column);
            }

            this.columns = columns;
        }
    }

    private updateTableOptions(
        updatedOptions: Partial<TanStackTableOptionsResolved<TData>>
    ): void {
        this.options = { ...this.options, ...updatedOptions };
        this.update(this.table.initialState);
    }

    private readonly update = (state: TanStackTableState): void => {
        this.table.setOptions(prev => ({
            ...prev,
            ...this.options,
            state,
            onStateChange: (updater: unknown) => {
                const updatedState = typeof updater === 'function'
                    ? (updater(state) as TanStackTableState)
                    : (updater as TanStackTableState);
                this.update(updatedState);
            }
        }));
    };

    // Temporarily auto-detect the keys in TData to make columns.
    private generateColumns(): void {
        if (this.data.length === 0) {
            return;
        }

        const firstItem = this.data[0]!;
        const keys = Object.keys(firstItem);
        const generatedColumns = keys.map(key => {
            const columnDef: TanStackColumnDef<TData> = {
                id: key,
                accessorKey: key,
                header: key
            };
            return columnDef;
        });

        this.updateTableOptions({ columns: generatedColumns });
    }
}

const nimbleTable = Table.compose({
    baseName: 'table',
    template,
    styles
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleTable());
