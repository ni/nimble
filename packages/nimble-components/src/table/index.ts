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

declare global {
    interface HTMLElementTagNameMap {
        'nimble-table': Table;
    }
}

/**
 * A nimble-styled table.
 */
export class Table<TData extends { [key: string]: unknown } = { [key: string]: unknown } > extends FoundationElement {
    @observable
    public data: TData[] = [];

    @observable
    public tableData: string[][] = [];

    private readonly table: TanstackTable<TData>;
    private options: TableOptionsResolved<TData>;
    private columns: ColumnDef<TData>[] = [];
    private columnHeaders: string[] = [];

    public constructor() {
        super();
        const initialData = this.data;
        this.options = {
            get data(): TData[] {
                return initialData;
            },
            onStateChange: (_: Updater<TableState>) => { },
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
        if ((!prev || prev.length === 0) && (next && next.length > 0)) {
            this.generateColumns();
        }

        if (prev && next) {
            this.options = { ...this.options, data: this.data };
            this.update(this.table.initialState);
            this.refreshRows();
        }
    }

    public getColumnHeaders(): string[] {
        return this.columnHeaders;
    }

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

    private refreshHeaders(): void {
        const headerGroups = this.table.getHeaderGroups();
        const headers = (headerGroups.length > 0 && headerGroups[0]) ? headerGroups[0]?.headers : [];
        this.columnHeaders = headers.map(header => this.columns[header.index]?.header as string || '');
    }

    private readonly update = (state: TableState): void => {
        this.table.setOptions(prev => ({
            ...prev,
            ...this.options,
            state,
            onStateChange: (updater: unknown) => {
                const updatedState = typeof updater === 'function' ? updater(state) as TableState : updater as TableState;
                this.update(updatedState);
            }
        }));
    };

    private generateColumns(): void {
        if (this.data.length === 0) {
            return;
        }

        const firstItem = this.data[0]!;
        const keys = Object.keys(firstItem);
        this.columns = keys.map(key => {
            const columnDef: ColumnDef<TData> = {
                id: key,
                accessorKey: key,
                header: key
            };
            return columnDef;
        });

        this.options = { ...this.options, columns: this.columns };
        this.update(this.table.initialState);
        this.refreshHeaders();
    }
}

const nimbleTable = Table.compose({
    baseName: 'table',
    template,
    styles
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleTable());
