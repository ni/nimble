import { customElement, observable, volatile } from '@ni/fast-element';
import type {
    TableColumnAnchorCellRecord,
    TableColumnAnchorColumnConfig
} from '..';
import type { Anchor } from '../../../anchor';
import { TableCellView } from '../../base/cell-view';
import { styles } from './styles';
import { template } from './template';

export const tableColumnAnchorCellViewTag = 'nimble-table-column-anchor-cell-view';

declare global {
    interface HTMLElementTagNameMap {
        [tableColumnAnchorCellViewTag]: TableColumnAnchorCellView;
    }
}

/**
 * A cell view for displaying links
 */
@customElement({
    name: tableColumnAnchorCellViewTag,
    template,
    styles
})
export class TableColumnAnchorCellView extends TableCellView<
    TableColumnAnchorCellRecord,
    TableColumnAnchorColumnConfig
> {
    /** @internal */
    @observable
    public hasOverflow = false;

    /** @internal */
    @observable
    public isPlaceholder = false;

    /** @internal */
    public anchor?: Anchor;

    @volatile
    public get text(): string {
        const displayedText = this.cellRecord?.label ?? this.cellRecord?.href;
        if (
            (displayedText === undefined || displayedText === null)
            && this.columnConfig?.placeholder
        ) {
            this.isPlaceholder = true;
            return this.columnConfig.placeholder;
        }

        this.isPlaceholder = false;
        if (typeof this.cellRecord?.label === 'string') {
            return this.cellRecord.label;
        }
        if (typeof this.cellRecord?.href === 'string') {
            return this.cellRecord.href;
        }
        return '';
    }

    /** @internal */
    @volatile
    public get showAnchor(): boolean {
        return typeof this.cellRecord?.href === 'string';
    }

    public override get tabbableChildren(): HTMLElement[] {
        if (this.showAnchor) {
            return [this.anchor!];
        }
        return [];
    }
}
