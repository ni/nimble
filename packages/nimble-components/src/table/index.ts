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
import {
    Virtualizer,
    VirtualizerOptions,
    elementScroll,
    observeElementOffset,
    observeElementRect,
    VirtualItem
} from '@tanstack/virtual-core';
import { controlHeight } from '../theme-provider/design-tokens';
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

    // TODO: Temporarily expose the columns as a string array. This will ultimately be
    // column definitions provided by slotted elements.
    @observable
    public columns: string[] = [];

    // TODO: Temporarily expose the column headers as a string array.
    @observable
    public columnHeaders: string[] = [];

    /**
     * @internal
     */
    public readonly headerContainer!: HTMLElement;

    /**
     * @internal
     */
    public readonly rowContainer!: HTMLElement;

    /**
     * @internal
     */
    public readonly viewport!: HTMLElement;

    /**
     * @internal
     */
    public virtualizer?: Virtualizer<HTMLElement, HTMLElement>;

    /**
     * @internal
     */
    @observable
    public visibleItems: VirtualItem[] = [];

    /**
     * @internal
     */
    @observable
    public rowContainerHeight = 0;

    private readonly table: TanStackTable<TData>;
    private options: TanStackTableOptionsResolved<TData>;
    private readonly tableInitialized: boolean = false;

    private readonly viewportResizeObserver: ResizeObserver;

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
        this.viewportResizeObserver = new ResizeObserver(
            this.updateVirtualizer.bind(this)
        );
    }

    public override connectedCallback(): void {
        super.connectedCallback();
        this.viewportResizeObserver.observe(this.viewport);
    }

    public override disconnectedCallback(): void {
        super.disconnectedCallback();
        this.viewportResizeObserver.disconnect();
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
            this.updateVirtualizer();
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

    private createVirtualizerOptions(): VirtualizerOptions<
    HTMLElement,
    HTMLElement
    > {
        return {
            count: this.data.length,
            getScrollElement: () => {
                return this.viewport;
            },
            estimateSize: (_: number) => parseFloat(controlHeight.getValueFor(this)),
            enableSmoothScroll: true,
            scrollToFn: elementScroll,
            observeElementOffset,
            observeElementRect,
            onChange: (virtualizer: Virtualizer<HTMLElement, HTMLElement>) => {
                this.visibleItems = virtualizer.getVirtualItems();
                if (this.visibleItems.length > 0) {
                    const firstItem = this.visibleItems[0]!;
                    const lastItem = this.visibleItems[this.visibleItems.length - 1]!;
                    if (lastItem.end >= this.rowContainerHeight) {
                        this.rowContainer.style.transform = '';
                    } else {
                        const offsetY = firstItem.start - this.viewport.scrollTop;
                        this.rowContainer.style.transform = `translateY(${offsetY}px)`;
                    }
                } else {
                    this.rowContainer.style.transform = '';
                }
                const horizontalScrollBarWidth = this.viewport.getBoundingClientRect().width
                    - this.viewport.scrollWidth;
                this.headerContainer.style.marginRight = `${horizontalScrollBarWidth}px`;
            }
        } as VirtualizerOptions<HTMLElement, HTMLElement>;
    }

    private updateVirtualizer(): void {
        if (this.virtualizer) {
            this.virtualizer.setOptions(this.createVirtualizerOptions());
        } else {
            this.virtualizer = new Virtualizer(this.createVirtualizerOptions());
        }
        this.virtualizer._willUpdate();
        this.visibleItems = this.virtualizer.getVirtualItems();
        this.rowContainerHeight = this.virtualizer.getTotalSize();
    }
}

const nimbleTable = Table.compose({
    baseName: 'table',
    template,
    styles
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleTable());
