import { observable, volatile } from '@microsoft/fast-element';
import { DesignSystem } from '@microsoft/fast-foundation';
import type {
    TableColumnAnchorCellRecord,
    TableColumnAnchorColumnConfig
} from '..';
import type { Anchor } from '../../../anchor';
import { TableCellView } from '../../base/cell-view';

/**
 * A cell view for displaying links
 */
export class TableColumnAnchorCellView extends TableCellView<
TableColumnAnchorCellRecord,
TableColumnAnchorColumnConfig
> {
    /** @internal */
    @observable
    public hasOverflow = false;

    /** @internal */
    public anchor?: Anchor;

    @volatile
    public get text(): string {
        if (typeof this.cellRecord?.label === 'string') {
            return this.cellRecord.label;
        }
        if (typeof this.cellRecord?.href === 'string') {
            return this.cellRecord.href;
        }
        return '';
    }

    public override focusedRecycleCallback(): void {
        this.anchor?.blur();
    }
}

export const tableColumnAnchorCellViewTag = DesignSystem.tagFor(
    TableColumnAnchorCellView
);
