import type { TableRecord, TableRowState } from '../../types';
import { SelectionManagerBase } from './selection-manager-base';

/**
 * Selection manager for interactive selection when the selection mode of the table is
 * `TableRowSelectionMode.single`.
 */
export class SingleSelectionManager<
    TData extends TableRecord
> extends SelectionManagerBase<TData> {
    public override handleRowSelectionToggle(
        rowState: TableRowState,
        isSelecting: boolean,
        _shiftKey: boolean
    ): boolean {
        this.toggleIsRowSelected(rowState, isSelecting);
        return true;
    }

    public override handleRowClick(
        rowState: TableRowState,
        _shiftKey: boolean,
        _ctrlKey: boolean
    ): boolean {
        return this.selectSingleRow(rowState);
    }

    public override handleActionMenuOpening(rowState: TableRowState): boolean {
        return this.handleRowClick(rowState, false, false);
    }
}
