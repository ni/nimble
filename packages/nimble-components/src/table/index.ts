import { attr, DOM, observable } from '@microsoft/fast-element';
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
import { TableColumn } from '../table-column/base';
import { TableValidator } from './models/table-validator';
import { styles } from './styles';
import { template } from './template';
import type { TableRecord, TableRowState, TableValidity } from './types';
import { Virtualizer } from './models/virtualizer';

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
    public idFieldName?: string;

    /**
     * @internal
     */
    @observable
    public tableData: TableRowState<TData>[] = [];

    @observable
    public columns: TableColumn[] = [];

    /**
     * @internal
     */
    @observable
    public readonly childItems: Element[] = [];

    /**
     * @internal
     */
    @observable
    public canRenderRows = true;

    public get validity(): TableValidity {
        return this.tableValidator.getValidity();
    }

    /**
     * @internal
     */
    public readonly viewport!: HTMLElement;

    /**
     * @internal
     */
    public readonly virtualizer: Virtualizer<TData>;

    private readonly table: TanStackTable<TData>;
    private options: TanStackTableOptionsResolved<TData>;
    private readonly tableValidator = new TableValidator();

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
        this.virtualizer = new Virtualizer(this);
    }

    public setData(newData: readonly TData[]): void {
        this.generateTanStackColumns(newData);
        this.setTableData(newData);
    }

    public idFieldNameChanged(
        _prev: string | undefined,
        _next: string | undefined
    ): void {
        // Force TanStack to detect a data update because a row's ID is only
        // generated when creating a new row model.
        this.setTableData(this.table.options.data);
    }

    public override connectedCallback(): void {
        super.connectedCallback();
        this.virtualizer.connectedCallback();
        this.updateColumnsFromChildren();
    }

    public override disconnectedCallback(): void {
        this.virtualizer.disconnectedCallback();
    }

    public checkValidity(): boolean {
        return this.tableValidator.isValid();
    }

    private setTableData(newData: readonly TData[]): void {
        const data = newData.map(record => {
            return { ...record };
        });
        this.tableValidator.validateRecordIds(data, this.idFieldName);
        this.canRenderRows = this.checkValidity();

        const getRowIdFunction = this.idFieldName === null || this.idFieldName === undefined
            ? undefined
            : (record: TData) => record[this.idFieldName!] as string;
        this.updateTableOptions({
            data,
            getRowId: getRowIdFunction
        });
    }

    private refreshRows(): void {
        const rows = this.table.getRowModel().rows;
        this.tableData = rows.map(row => {
            const rowState: TableRowState<TData> = {
                record: row.original,
                id: row.id
            };
            return rowState;
        });
        this.virtualizer.dataChanged();
    }

    private updateTableOptions(
        updatedOptions: Partial<TanStackTableOptionsResolved<TData>>
    ): void {
        this.options = { ...this.options, ...updatedOptions };
        this.update(this.table.initialState);
        this.refreshRows();
    }

    // This is a workaround for dealing with a change in Safari 16+. It seems related to this bug, filed
    // against WebKit: https://bugs.webkit.org/show_bug.cgi?id=246899, which was closed as "intentional"
    // behavior change. The issue we faced was that using a filter for the `children` directive in the
    // template that required JS object APIs (like instanceOf) did not work because the elements being
    // filtered were not fully initialized JS objects.
    // Note that the FAST DataGrid does something similar to this (using DOM.queueUpdate) to update its row indexes.
    private updateColumnsFromChildren(): void {
        DOM.queueUpdate(() => {
            this.columns = this.childItems.filter((x): x is TableColumn => x instanceof TableColumn);
        });
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

    // Generate columns for TanStack that correspond to all the keys in TData because all operations,
    // such as grouping and sorting, will be performed on the data's records, not the values rendered within a cell.
    private generateTanStackColumns(data: readonly TData[]): void {
        if (data.length === 0) {
            return;
        }

        const firstItem = data[0]!;
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
