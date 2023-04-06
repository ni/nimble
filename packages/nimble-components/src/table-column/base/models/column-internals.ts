import { uniqueId } from '@microsoft/fast-web-utilities';
import { ViewTemplate, observable } from '@microsoft/fast-element';
import type { TableFieldName } from '../../../table/types';
import type { TableCell } from '../../../table/components/cell';
import { createCellViewTemplate } from '../../../table/components/cell/template';
import { TableColumnSortOperation } from '../types';
import type { TableGroupRow } from '../../../table/components/group-row';
import { createGroupHeaderViewTemplate } from '../group-header-view/template';

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
