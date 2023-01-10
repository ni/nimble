import type { ElementStyles, ViewTemplate } from '@microsoft/fast-element';
import { FoundationElement } from '@microsoft/fast-foundation';
import type { TableCellState, TableRecord } from '../../table/types';

/**
 * The base class for table columns
 */
export abstract class TableColumn<
    TCellData extends TableRecord = TableRecord,
    TColumnConfig = unknown
> extends FoundationElement {
    /**
     * The template to use to render the cell content for the column
     */
    public abstract cellTemplate: ViewTemplate<
    TableCellState<TCellData, TColumnConfig>
    >;

    /**
     * The style to apply to the cellTemplate
     */
    public cellStyles?: ElementStyles;

    /**
     * The keys that should be present in TCellData.
     * This array is parallel with the keys returned from `getRecordFieldNames()`.
     */
    public abstract readonly cellStateDataFieldNames: readonly string[];

    /**
     * This method returns the relevant, static configuration a column requires its cellTemplate
     * to have access to.
     */
    public abstract getColumnConfig?(): TColumnConfig;

    /**
     * The keys from the row data that correlate to the data that will be in TCellData.
     * This array is parallel with the keys specified by `cellStateDataFieldNames`.
     */
    public abstract getRecordFieldNames(): string[];
}
