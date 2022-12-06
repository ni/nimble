import { observable } from '@microsoft/fast-element';
import { DesignSystem, FoundationElement } from '@microsoft/fast-foundation';
import {
    ColumnDef,
    TableState,
    Updater,
    Table as TanstackTable,
    createTable,
    getCoreRowModel,
    TableOptionsResolved
} from '@tanstack/table-core';
import { styles } from './styles';
import { template } from './template';
import type { TableData } from './types';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-table': Table;
    }
}

/**
 * A nimble-styled table.
 */
export class Table<
    TData extends TableData = {
        [key: string]: string | number | boolean | Date | null | undefined
    }
> extends FoundationElement {
    @observable
    public data: TData[] = [];

    // TODO: Temporarily assume that the data in the table can be represented as strings.
    @observable
    public tableData: string[][] = [];

    private readonly table: TanstackTable<TData>;
    private options: TableOptionsResolved<TData>;
    private columnHeaders: string[] = [];

    public constructor() {
        super();
        const initialData = this.data;
        this.options = {
            get data(): TData[] {
                return initialData;
            },
            onStateChange: (_: Updater<TableState>) => {},
            getCoreRowModel: getCoreRowModel(),
            columns: [],
            state: {},
            renderFallbackValue: null,
            autoResetAll: false
        };
        this.table = createTable(this.options);
    }

    public dataChanged(
        prev: TData[] | undefined,
        next: TData[] | undefined
    ): void {
        if ((!prev || prev.length === 0) && next && next.length > 0) {
            this.generateColumns();
        }

        // Ignore any updates that occur prior to the TanStack table being initialized.
        if (this.table) {
            this.updateTableOptions({ data: this.data });
            this.refreshRows();
        }
    }

    public getColumnHeaders(): string[] {
        return this.columnHeaders;
    }

    // TODO: For now, assume all cells can be rendered as strings. Ultimately, the data
    // should be passed to nimble-row elements to use the view template from a column definition.
    private refreshRows(): void {
        const tableData: string[][] = [];
        const rows = this.table.getRowModel().rows;
        for (const row of rows) {
            const rowArray: string[] = [];
            for (const cell of row.getVisibleCells()) {
                rowArray.push(cell.getValue() as string);
            }
            tableData.push(rowArray);
        }
        this.tableData = tableData;
    }

    private updateTableOptions(
        updatedOptions: Partial<TableOptionsResolved<TData>>
    ): void {
        this.options = { ...this.options, ...updatedOptions };
        this.update(this.table.initialState);
    }

    private readonly update = (state: TableState): void => {
        this.table.setOptions(prev => ({
            ...prev,
            ...this.options,
            state,
            onStateChange: (updater: unknown) => {
                const updatedState = typeof updater === 'function'
                    ? (updater(state) as TableState)
                    : (updater as TableState);
                this.update(updatedState);
            }
        }));
    };

    // Temporarily auto-detect the keys in TData to make columns.
    // TODO: Remove this logic when another way to specify columns is provided.
    private generateColumns(): void {
        if (this.data.length === 0) {
            return;
        }

        const firstItem = this.data[0]!;
        const keys = Object.keys(firstItem);
        const generatedColumns = keys.map(key => {
            const columnDef: ColumnDef<TData> = {
                id: key,
                accessorKey: key,
                header: key
            };
            return columnDef;
        });

        this.updateTableOptions({ columns: generatedColumns });
        this.columnHeaders = generatedColumns.map(x => x.header as string);
    }
}

const nimbleTable = Table.compose({
    baseName: 'table',
    template,
    styles
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleTable());
