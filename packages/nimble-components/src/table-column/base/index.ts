import {
    Observable,
    attr,
    nullableNumberConverter,
    observable
} from '@microsoft/fast-element';
import { FoundationElement } from '@microsoft/fast-foundation';
import { TableColumnSortDirection } from '../../table/types';
import {
    ColumnInternalOptions,
    ColumnInternals
} from './models/column-internals';
import { defaultFractionalWidth } from './types';

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
     * Used by the Table in order to give a column a specific pixel width.
     * When set 'currentFractionalWidth' will be ignored.
     */
    @observable
    public currentPixelWidth?: number;

    /**
     * @internal
     * Used by the Table in order to size a column proportionally to the available
     * width of a row.
     */
    @observable
    public currentFractionalWidth = defaultFractionalWidth;

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
        const notifier = Observable.getNotifier(this.columnInternals);
        notifier.subscribe(
            {
                handleChange: () => {
                    this.currentFractionalWidth = this.columnInternals.fractionalWidth;
                }
            },
            'fractionalWidth'
        );
        notifier.subscribe(
            {
                handleChange: () => {
                    this.currentPixelWidth = this.columnInternals.pixelWidth;
                }
            },
            'pixelWidth'
        );
    }

    /**
     * @internal
     */
    public override connectedCallback(): void {
        super.connectedCallback();

        this.setAttribute('slot', this.columnInternals.uniqueId);
    }
}
