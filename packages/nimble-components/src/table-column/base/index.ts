import { attr, nullableNumberConverter } from '@microsoft/fast-element';
import { FoundationElement } from '@microsoft/fast-foundation';
import { TableColumnSortDirection } from '../../table/types';
import { ColumnInternals, ColumnInternalsOptions } from './models/column-internals';

/**
 * The base class for table columns
 */
export abstract class TableColumn<
    TColumnConfig = unknown
> extends FoundationElement {
    @attr({ attribute: 'column-id' })
    public columnId?: string;

    @attr({ attribute: 'action-menu-slot' })
    public actionMenuSlot?: string;

    @attr({ attribute: 'action-menu-label' })
    public actionMenuLabel?: string;

    @attr({ attribute: 'column-hidden', mode: 'boolean' })
    public columnHidden = false;

    @attr({ attribute: 'sort-index', converter: nullableNumberConverter })
    public sortIndex?: number | null;

    @attr({ attribute: 'sort-direction' })
    public sortDirection: TableColumnSortDirection = TableColumnSortDirection.none;

    @attr({ attribute: 'sorting-disabled', mode: 'boolean' })
    public sortingDisabled = false;

    /**
     * @internal
     *
     * Column properties configurable by plugin authors
     */
    public readonly columnInternals: ColumnInternals<TColumnConfig> = new ColumnInternals(this.getColumnInternalsOptions());

    protected abstract getColumnInternalsOptions(): ColumnInternalsOptions;

    protected sortDirectionChanged(): void {
        if (!this.sortingDisabled) {
            this.columnInternals.currentSortDirection = this.sortDirection;
        }
    }

    protected sortIndexChanged(): void {
        if (!this.sortingDisabled) {
            this.columnInternals.currentSortIndex = this.sortIndex;
        }
    }

    protected sortingDisabledChanged(): void {
        if (this.sortingDisabled) {
            this.columnInternals.currentSortDirection = TableColumnSortDirection.none;
            this.columnInternals.currentSortIndex = undefined;
        } else {
            this.columnInternals.currentSortDirection = this.sortDirection;
            this.columnInternals.currentSortIndex = this.sortIndex;
        }
    }
}
