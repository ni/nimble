import {
    attr,
    ElementStyles,
    observable,
    ViewTemplate
} from '@microsoft/fast-element';
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
    @attr({ attribute: 'column-id' })
    public columnId?: string;

    @attr({ attribute: 'action-menu-slot' })
    public actionMenuSlot?: string;

    @attr({ attribute: 'action-menu-label' })
    public actionMenuLabel?: string;

    @attr({ attribute: 'column-hidden', mode: 'boolean' })
    public columnHidden = false;

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
     */
    public override connectedCallback(): void {
        super.connectedCallback();

        this.setAttribute('slot', uniqueId('table-column-slot'));
    }

    protected internalFractionalWidthChanged(): void {
        this.currentFractionalWidth = this.internalFractionalWidth;
    }

    protected internalPixelWidthChanged(): void {
        this.currentPixelWidth = this.internalPixelWidth;
    }
}
