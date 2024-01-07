import { observable, volatile } from '@microsoft/fast-element';
import { DesignSystem } from '@microsoft/fast-foundation';
import type {
    TableColumnAnchorCellRecord,
    TableColumnAnchorColumnConfig
} from '..';
import type { Anchor } from '../../../anchor';
import { TableCellView } from '../../base/cell-view';
import { styles } from './styles';
import { template } from './template';

const baseName = 'table-column-anchor-cell-view';
export const tableColumnAnchorCellViewTag = `nimble-${baseName}`;
declare global {
    interface HTMLElementTagNameMap {
        [tableColumnAnchorCellViewTag]: TableColumnAnchorCellView;
    }
}

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

const anchorCellView = TableColumnAnchorCellView.compose({
    baseName,
    template,
    styles
});
DesignSystem.getOrCreate().withPrefix('nimble').register(anchorCellView());
