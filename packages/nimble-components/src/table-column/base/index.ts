import type { ElementStyles, ViewTemplate } from '@microsoft/fast-element';
import { FoundationElement } from '@microsoft/fast-foundation';
import { uniqueId } from '@microsoft/fast-web-utilities';
import type {
    TableCellRecord,
    TableCellState,
    TableFieldName
} from '../../table/types';

/**
 * The base class for table columns
 */
export abstract class TableColumn<
    TCellRecord extends TableCellRecord = TableCellRecord,
    TColumnConfig = unknown
> extends FoundationElement {
    /**
     * The template to use to render the cell content for the column
     */
    // prettier-ignore
    public abstract cellTemplate: ViewTemplate<TableCellState<TCellRecord, TColumnConfig>>;

    /**
     * The style to apply to the cellTemplate
     */
    public abstract cellStyles?: ElementStyles;

    /**
     * The names of the fields that should be present in TCellRecord.
     * This array is parallel with the field names returned from `getDataRecordFieldNames()`.
     */
    public abstract readonly cellRecordFieldNames: readonly TableFieldName[];

    public override connectedCallback(): void {
        super.connectedCallback();

        this.setAttribute('slot', uniqueId('table-column-slot'));
    }

    /**
     * This method returns the relevant, static configuration a column requires its cellTemplate
     * to have access to.
     */
    public abstract getColumnConfig?(): TColumnConfig;

    /**
     * The names of the fields from the row's record that correlate to the data that will be in TCellRecord.
     * This array is parallel with the field names specified by `cellRecordFieldNames`.
     */
    public abstract getDataRecordFieldNames(): (TableFieldName | undefined)[];
}
