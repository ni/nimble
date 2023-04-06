import {
    ViewTemplate,
    attr,
    nullableNumberConverter,
    observable
} from '@microsoft/fast-element';
import { FoundationElement } from '@microsoft/fast-foundation';
import { createGroupHeaderViewTemplate } from './group-header-view/template';
import type { TableGroupRow } from '../../table/components/group-row';
import { TableColumnSortDirection } from '../../table/types';
import {
    ColumnInternalOptions,
    ColumnInternals
} from './models/column-internals';
import { defaultFractionalWidth, defaultMinPixelWidth } from './types';

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
     * Used by column plugins to set a specific pixel width. Sets currentPixelWidth when changed.
     */
    @observable
    public internalPixelWidth?: number;

    /**
     * @internal
     * Used by column plugins to size a column proportionally to the available
     * width of a row. Sets currentFractionalWidth when changed.
     */
    @observable
    public internalFractionalWidth = defaultFractionalWidth;

    /**
     * @internal
     * The minimum size in pixels according to the design doc
     */
    @observable
    public internalMinPixelWidth = defaultMinPixelWidth;

    /**
     * @internal
     * Whether or not this column can be used to group rows by
     */
    @observable
    public internalGroupingDisabled = false;

    /**
     * @internal
     * Specifies the grouping precedence of the column within the set of all columns participating in grouping.
     * Columns are rendered in the grouping tree from lowest group-index as the tree root to highest
     * group-index as tree leaves.
     */
    @observable
    public internalGroupIndex?: number;

    /**
     * The tag to use to render the group header content for a column.
     * The element this tag refers to must derive from TableGroupHeaderView.
     */
    @observable
    public abstract readonly groupHeaderViewTag?: string;

    /**
     * @internal
     */
    @observable
    public internalGroupHeaderViewTemplate?: ViewTemplate<TableGroupRow>;

    /**
     * @internal
     *
     * Column properties configurable by plugin authors
     */
    public readonly columnInternals: ColumnInternals<TColumnConfig>;

    public constructor(options: ColumnInternalOptions) {
        super();
        this.columnInternals = new ColumnInternals(options);
    }

    /**
     * @internal
     */
    public override connectedCallback(): void {
        super.connectedCallback();

        this.setAttribute('slot', this.columnInternals.uniqueId);
    }

    protected internalFractionalWidthChanged(): void {
        this.currentFractionalWidth = this.internalFractionalWidth;
    }

    protected internalPixelWidthChanged(): void {
        this.currentPixelWidth = this.internalPixelWidth;
    }

    protected groupHeaderViewTagChanged(): void {
        this.internalGroupHeaderViewTemplate = this.groupHeaderViewTag
            ? createGroupHeaderViewTemplate(this.groupHeaderViewTag)
            : undefined;
    }
}
