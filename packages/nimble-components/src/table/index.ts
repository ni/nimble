import { attr, observable } from '@microsoft/fast-element';
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
import { TableValidator } from './models/table-validator';
import { styles } from './styles';
import { template } from './template';
import type { TableRecord, TableRowState, TableValidity } from './types';

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
    @attr({ attribute: 'id-field-name' })
    public idFieldName?: string | null;

    @observable
    public data: TData[] = [];

    /**
     * @internal
     */
    @observable
    public tableData: TableRowState<TData>[] = [];

    // TODO: Temporarily expose the columns as a string array. This will ultimately be
    // column definitions provided by slotted elements.
    @observable
    public columns: string[] = [];

    // TODO: Temporarily expose the column headers as a string array.
    @observable
    public columnHeaders: string[] = [];

    public get validity(): TableValidity {
        return this.tableValidator.getValidity();
    }

    private readonly table: TanStackTable<TData>;
    private options: TanStackTableOptionsResolved<TData>;
    private readonly tableInitialized: boolean = false;
    private readonly tableValidator = new TableValidator();

    public constructor() {
        super();
        this.options = {
            data: [],
            onStateChange: (_: TanStackUpdater<TanStackTableState>) => {},
            getCoreRowModel: tanStackGetCoreRowModel(),
            getRowId: record => {
                if (this.idFieldName) {
                    return record[this.idFieldName] as string;
                }
                // Return a falsey value to use the default ID from TanStack.
                return '';
            },
            columns: [],
            state: {},
            renderFallbackValue: null,
            autoResetAll: false
        };
        this.table = tanStackCreateTable(this.options);
        this.tableInitialized = true;
    }

    public idFieldNameChanged(
        _prev: string | undefined,
        _next: string | undefined
    ): void {
        // Force TanStack to detect a data update because a row's ID is only
        // generated when creating a new row model.
        this.trySetData([...this.data]);
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
            this.trySetData(this.data);
        }
    }

    public checkValidity(): boolean {
        return this.tableValidator.isValid();
    }

    private trySetData(newData: TData[]): void {
        const areIdsValid = this.tableValidator.validateDataIds(
            newData,
            this.idFieldName
        );
        if (areIdsValid) {
            this.updateTableOptions({ data: newData });
        } else {
            this.updateTableOptions({ data: [] });
        }
    }

    private refreshRows(): void {
        const rows = this.table.getRowModel().rows;
        this.tableData = rows.map(row => {
            return { data: row.original, id: row.id } as TableRowState<TData>;
        });
    }

    private updateTableOptions(
        updatedOptions: Partial<TanStackTableOptionsResolved<TData>>
    ): void {
        this.options = { ...this.options, ...updatedOptions };
        this.update(this.table.initialState);
        this.refreshRows();
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
    // TODO: Remove this logic when another way to specify columns is provided.
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
        this.columnHeaders = generatedColumns.map(x => x.header as string);
        this.columns = this.columnHeaders;
    }
}

const nimbleTable = Table.compose({
    baseName: 'table',
    template,
    styles
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleTable());
