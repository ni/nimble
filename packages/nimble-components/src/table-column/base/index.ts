import {
    attr,
    nullableNumberConverter,
} from '@microsoft/fast-element';
import { FoundationElement } from '@microsoft/fast-foundation';
import { TableColumnSortDirection } from '../../table/types';
import {
    ColumnInternalOptions,
    ColumnInternals
} from './models/column-internals';

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

    /**
     * @internal
     *
     * Column properties configurable by plugin authors
     */
    public readonly columnInternals: ColumnInternals<TColumnConfig>;

    public constructor(options: ColumnInternalOptions) {
        super();
        if (!options) {
            throw new Error(
                'ColumnInternalsOptions must be provided to constructor'
            );
        }
        this.columnInternals = new ColumnInternals(options);
    }
}
