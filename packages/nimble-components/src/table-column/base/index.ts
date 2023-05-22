import { attr, nullableNumberConverter } from '@microsoft/fast-element';
import { FoundationElement } from '@microsoft/fast-foundation';
import { TableColumnSortDirection } from '../../table/types';
import {
    ColumnInternalsOptions,
    ColumnInternals
} from './models/column-internals';
import type { TableColumnValidity } from './types';

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
    public readonly columnInternals: ColumnInternals<TColumnConfig>;

    public constructor(options: ColumnInternalsOptions) {
        super();
        if (!options) {
            throw new Error(
                'ColumnInternalsOptions must be provided to constructor'
            );
        }
        this.columnInternals = new ColumnInternals(options);
        this.columnInternals.currentSortDirection = this.sortDirection;
        this.columnInternals.currentSortIndex = this.sortIndex;
    }

    public checkValidity(): boolean {
        return this.columnInternals.validConfiguration;
    }

    public get validity(): TableColumnValidity {
        return {};
    }

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
        // Ignore the default value sortingDisabled initialization from undefined to false (which runs before columnInternals is initialized)
        if (this.columnInternals) {
            if (this.sortingDisabled) {
                this.columnInternals.currentSortDirection = TableColumnSortDirection.none;
                this.columnInternals.currentSortIndex = undefined;
            } else {
                this.columnInternals.currentSortDirection = this.sortDirection;
                this.columnInternals.currentSortIndex = this.sortIndex;
            }
        }
    }
}
