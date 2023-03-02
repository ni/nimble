import {
    attr,
    ElementStyles,
    nullableNumberConverter,
    observable,
    ViewTemplate
} from '@microsoft/fast-element';
import { FoundationElement } from '@microsoft/fast-foundation';
import { uniqueId } from '@microsoft/fast-web-utilities';
import {
    TableColumnSortDirection,
    TableFieldName
} from '../../table/types';
import {
    TableCellRecord,
    TableCellState,
    TableColumnSortOperation
} from './types';

/**
 * The base class for table columns
 */
export abstract class TableColumn<
    TCellRecord extends TableCellRecord = TableCellRecord,
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
     * The template to use to render the cell content for the column
     */
    // prettier-ignore
    public abstract readonly cellTemplate: ViewTemplate<TableCellState<TCellRecord, TColumnConfig>>;

    /**
     * @internal
     *
     * The style to apply to the cellTemplate
     */
    public abstract readonly cellStyles?: ElementStyles;

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
     * The relevant, static configuration a column requires its cellTemplate to have access to.
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
}
