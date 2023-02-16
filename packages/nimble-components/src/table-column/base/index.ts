import {
    ElementStyles,
    observable,
    ViewTemplate
} from '@microsoft/fast-element';
import { FoundationElement } from '@microsoft/fast-foundation';
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
     * @internal
     * Used by the Table in order to give a column a specific pixel width.
     * When set 'currentFractionalWidth' will be ignored.
     */
    @observable
    public currentPixelWidth: number | null = null;

    /**
     * @internal
     * Used by the Table in order to size a column proportionally to the available
     * width of a row.
     */
    @observable
    public currentFractionalWidth = 1;

    /**
     * @internal
     * Used by column plugins to set a specific pixel width. Sets currentPixelWidth when changed.
     */
    @observable
    public internalPixelWidth: number | null = null;

    /**
     * @internal
     * Used by column plugins to size a column proportionally to the available
     * width of a row. Sets currentFractionalWidth when changed.
     */
    @observable
    public internalFractionalWidth = 1;

    /**
     * @internal
     * The minimum size in pixels according to the design doc
     */
    @observable
    public internalMinPixelWidth = 88;

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

    protected internalFractionalWidthChanged(): void {
        this.currentFractionalWidth = this.internalFractionalWidth;
    }

    protected internalPixelWidthChanged(): void {
        this.currentPixelWidth = this.internalPixelWidth;
    }
}
