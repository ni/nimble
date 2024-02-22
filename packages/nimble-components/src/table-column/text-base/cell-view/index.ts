import { observable } from '@microsoft/fast-element';
import { TableCellView } from '../../base/cell-view';
import type { TableCellRecord } from '../../base/types';
import { TextCellViewBaseAlignment } from './types';
import type { TableFieldValue } from '../../../table/types';

/**
 * The cell view base class for displaying fields of any type as text.
 */
export abstract class TableColumnTextCellViewBase<
    TCellRecord extends TableCellRecord = TableCellRecord,
    TColumnConfig = unknown
> extends TableCellView<TCellRecord, TColumnConfig> {
    /** @internal */
    @observable
    public hasOverflow = false;

    /**
     * Text to render in the cell.
     */
    @observable
    public text = '';

    /**
     * Whether or not the text being displayed in the cell view is a placeholder.
     */
    @observable
    public isPlaceholder = false;

    /**
     * The alignment of the text within the cell.
     */
    @observable
    public alignment: TextCellViewBaseAlignment = TextCellViewBaseAlignment.left;

    protected applyPlaceholderTextIfNeeded(cellValue: TableFieldValue, placeholder: string | undefined): boolean {
        if (placeholder && (cellValue === null || cellValue === undefined)) {
            this.text = placeholder;
            this.isPlaceholder = true;
        } else {
            this.isPlaceholder = false;
        }

        return this.isPlaceholder;
    }
}
