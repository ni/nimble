import type { TableRecord, TableRowState } from '../../types';
import { SelectionManagerBase } from './selection-manager-base';

/**
 * Selection manager for interactive selection when the selection mode of the table is
 * `TableRowSelectionMode.none`.
 */
export class DisabledSelectionManager<
    TData extends TableRecord
> extends SelectionManagerBase<TData> {
    public override handleRowSelectionToggle(
        _rowState: TableRowState,
        _isSelecting: boolean,
        _shiftKey: boolean
    ): boolean {
        return false;
    }

    public override handleRowClick(
        _rowState: TableRowState,
        _shiftKey: boolean,
        _ctrlKey: boolean
    ): boolean {
        return false;
    }

    public override handleActionMenuOpening(_rowState: TableRowState): boolean {
        return false;
    }
}
