import {
    attr,
    nullableNumberConverter,
    observable,
    ViewTemplate
} from '@microsoft/fast-element';
import { FoundationElement } from '@microsoft/fast-foundation';
import { uniqueId } from '@microsoft/fast-web-utilities';
import { createGroupHeaderViewTemplate } from '../../table/components/group-header-view/template';
import type { TableGroupRow } from '../../table/components/group-row';
import type { TableCell } from '../../table/components/cell';
import { createCellViewTemplate } from '../../table/components/cell/template';
import { TableColumnSortDirection, TableFieldName } from '../../table/types';
import {
    defaultFractionalWidth,
    defaultMinPixelWidth,
    TableColumnSortOperation
} from './types';

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
     * Whether or not a column can be used to group rows by
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
     * The template to use to render the cell content for the column
     * The tag (element name) of the custom element that renders the cell content for the column.
     * That element should derive from TableCellView<TCellRecord, TColumnConfig>.
     */
    @observable
    public abstract readonly cellViewTag: string;

    /* @internal */
    @observable
    public currentCellViewTemplate?: ViewTemplate<TableCell>;

    /**
     * @internal
     *
     * The names of the fields that should be present in TCellRecord.
     * This array is parallel with the field names specified by `dataRecordFieldNames`.
     */
    public abstract readonly cellRecordFieldNames: readonly TableFieldName[];

    /**
     * @internal
     *
     * The names of the fields from the row's record that correlate to the data that will be in TCellRecord.
     * This array is parallel with the field names specified by `cellRecordFieldNames`.
     */
    @observable
    public dataRecordFieldNames: readonly (TableFieldName | undefined)[] = [];

    /**
     * @internal
     *
     * The relevant, static configuration a column requires its cell view to have access to.
     */
    @observable
    public columnConfig?: TColumnConfig;

    /**
     * @internal
     *
     * The name of the data field that will be used for operations on the table, such as sorting and grouping.
     */
    @observable
    public operandDataRecordFieldName?: TableFieldName;

    /**
     * @internal
     *
     * The operation to use when sorting the table by this column.
     */
    @observable
    public sortOperation: TableColumnSortOperation = TableColumnSortOperation.basic;

    /**
     * @internal
     *
     * Properties prefixed with `internal` are for internal table-use only.
     */
    public readonly internalUniqueId: string;

    public constructor() {
        super();
        this.internalUniqueId = uniqueId('table-column-slot');
    }

    /**
     * @internal
     */
    public override connectedCallback(): void {
        super.connectedCallback();

        this.setAttribute('slot', this.internalUniqueId);
    }

    protected cellViewTagChanged(): void {
        this.currentCellViewTemplate = this.cellViewTag
            ? createCellViewTemplate(this.cellViewTag)
            : undefined;
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
