import { observable } from '@microsoft/fast-element';
import { TableCellView } from '../../base/cell-view';
import type { TableCellRecord } from '../../base/types';
import { TextCellViewBaseAlignment } from './types';

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
     * The alignment of the text within the cell.
     */
    @observable
    public alignment: TextCellViewBaseAlignment = TextCellViewBaseAlignment.left;
}
