import { uniqueId } from '@microsoft/fast-web-utilities';
import { ViewTemplate, observable } from '@microsoft/fast-element';
import { TableColumnSortDirection, TableFieldName } from '../../../table/types';
import type { TableCell } from '../../../table/components/cell';
import {
    TableColumnSortOperation,
    defaultFractionalWidth,
    defaultMinPixelWidth
} from '../types';
import type { TableGroupRow } from '../../../table/components/group-row';
import { createGroupHeaderViewTemplate } from '../group-header-view/template';
import { createCellViewTemplate } from '../cell-view/template';

export interface ColumnInternalsOptions {
    /**
     * The tag (element name) of the custom element that renders the cell content for the column.
     * That element should derive from TableCellView<TCellRecord, TColumnConfig>.
     */
    readonly cellViewTag: string;

    /**
     * The names of the fields that should be present in TCellRecord.
     * This array is parallel with the field names specified by `dataRecordFieldNames`.
     */
    readonly cellRecordFieldNames: readonly TableFieldName[];

    /**
     * The tag to use to render the group header content for a column.
     * The element this tag refers to must derive from TableGroupHeaderView.
     */
    readonly groupHeaderViewTag: string;

    /**
     * The names of events that should be delegated from the cell view to the column.
     */
    readonly delegatedEvents: readonly string[];

    /**
     * The sort operation to use for the column (defaults to TableColumnSortOperation.basic)
     */
    readonly sortOperation?: TableColumnSortOperation;
}

/**
 * Internal column state configured by plugin authors
 * @internal
 */
export class ColumnInternals<TColumnConfig> {
    /**
     * @see ColumnInternalsOptions.cellRecordFieldNames
     */
    public readonly cellRecordFieldNames: readonly TableFieldName[];

    /**
     * A unique id used internally in the table to identify specific column instances
     */
    public readonly uniqueId = uniqueId('table-column-slot');

    /**
     * Template for the cell view
     */
    public readonly cellViewTemplate: ViewTemplate<TableCell>;

    /**
     * The names of events that should be delegated from the cell view to the column.
     */
    public readonly delegatedEvents: readonly string[];

    /**
     * The relevant, static configuration a column requires its cell view to have access to.
     */
    @observable
    public columnConfig?: TColumnConfig;

    /**
     * The name of the data field that will be used for operations on the table, such as sorting and grouping.
     */
    @observable
    public operandDataRecordFieldName?: TableFieldName;

    /**
     * The operation to use when sorting the table by this column.
     */
    @observable
    public sortOperation: TableColumnSortOperation = TableColumnSortOperation.basic;

    /**
     * The names of the fields from the row's record that correlate to the data that will be in TCellRecord.
     * This array is parallel with the field names specified by `cellRecordFieldNames`.
     */
    @observable
    public dataRecordFieldNames: readonly (TableFieldName | undefined)[] = [];

    /**
     * Template for the group header view
     */
    public readonly groupHeaderViewTemplate: ViewTemplate<TableGroupRow>;

    /**
     * Whether or not this column can be used to group rows by
     */
    @observable
    public groupingDisabled = false;

    /**
     * Specifies the grouping precedence of the column within the set of all columns participating in grouping.
     * Columns are rendered in the grouping tree from lowest group-index as the tree root to highest
     * group-index as tree leaves.
     */
    @observable
    public groupIndex?: number;

    /**
     * Used by column plugins to set a specific pixel width. Sets currentPixelWidth when changed.
     */
    @observable
    public pixelWidth?: number;

    /**
     * Used by column plugins to size a column proportionally to the available
     * width of a row. Sets currentFractionalWidth when changed.
     */
    @observable
    public fractionalWidth = defaultFractionalWidth;

    /**
     * The minimum size in pixels according to the design doc
     */
    @observable
    public minPixelWidth = defaultMinPixelWidth;

    /**
     * @internal Do not write to this value directly. It is used by the Table in order to store
     * the resolved value of the fractionalWidth after updates programmatic or interactive updates.
     */
    @observable
    public currentFractionalWidth = defaultFractionalWidth;

    /**
     * @internal Do not write to this value directly. It is used by the Table in order to store
     * the resolved value of the pixelWidth after programmatic or interactive updates.
     */
    @observable
    public currentPixelWidth?: number;

    /**
     * @internal Do not write to this value directly. It is used by the Table in order to store
     * the resolved value of the sortIndex after programmatic or interactive updates.
     */
    @observable
    public currentSortIndex?: number | null;

    /**
     * @internal Do not write to this value directly. It is used by the Table in order to store
     * the resolved value of the sortDirection after programmatic or interactive updates.
     */
    @observable
    public currentSortDirection: TableColumnSortDirection = TableColumnSortDirection.none;

    public constructor(options: ColumnInternalsOptions) {
        this.cellRecordFieldNames = options.cellRecordFieldNames;
        this.cellViewTemplate = createCellViewTemplate(options.cellViewTag);
        this.groupHeaderViewTemplate = createGroupHeaderViewTemplate(
            options.groupHeaderViewTag
        );
        this.delegatedEvents = options.delegatedEvents;
        this.sortOperation = options.sortOperation ?? TableColumnSortOperation.basic;
    }

    protected fractionalWidthChanged(): void {
        this.currentFractionalWidth = this.fractionalWidth;
    }

    protected pixelWidthChanged(): void {
        this.currentPixelWidth = this.pixelWidth;
    }
}
