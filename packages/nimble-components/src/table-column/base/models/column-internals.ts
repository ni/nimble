import { uniqueId } from '@microsoft/fast-web-utilities';
import { ViewTemplate, observable } from '@microsoft/fast-element';
import type { TableFieldName } from '../../../table/types';
import type { TableCell } from '../../../table/components/cell';
import {
    TableColumnSortOperation,
    defaultFractionalWidth,
    defaultMinPixelWidth
} from '../types';
import type { TableGroupRow } from '../../../table/components/group-row';
import { createGroupHeaderViewTemplate } from '../group-header-view/template';
import { createCellViewTemplate } from '../cell-view/template';

export interface ColumnInternalOptions {
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
     * The operation to use when sorting the table by this column.
     * Default is @see TableColumnSortOperation.basic
     */
    sortOperation?: TableColumnSortOperation;

    /**
     * The tag to use to render the group header content for a column.
     * The element this tag refers to must derive from TableGroupHeaderView.
     */
    readonly groupHeaderViewTag: string;
}

/**
 * Internal column state configured by plugin authors
 * @internal
 */
export class ColumnInternals<TColumnConfig> {
    /**
     * @see ColumnInternalOptions.cellRecordFieldNames
     */
    public readonly cellRecordFieldNames: readonly TableFieldName[];

    /**
     * Properties prefixed with `internal` are for internal table-use only.
     */
    public readonly uniqueId: string;

    /**
     * Template for the cell view
     */
    public readonly cellViewTemplate: ViewTemplate<TableCell>;

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
     * @see ColumnInternalOptions.sortOperation
     */
    @observable
    public sortOperation: TableColumnSortOperation;

    /**
     * @internal
     *
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
     * @internal
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

    public constructor(options: ColumnInternalOptions) {
        this.cellRecordFieldNames = options.cellRecordFieldNames;
        this.uniqueId = uniqueId('table-column-slot');
        this.cellViewTemplate = createCellViewTemplate(options.cellViewTag);
        this.sortOperation = options.sortOperation ?? TableColumnSortOperation.basic;
        this.groupHeaderViewTemplate = createGroupHeaderViewTemplate(
            options.groupHeaderViewTag
        );
    }
}
