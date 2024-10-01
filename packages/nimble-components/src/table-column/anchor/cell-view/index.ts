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

declare global {
    interface HTMLElementTagNameMap {
        'nimble-table-column-anchor-cell-view': TableColumnAnchorCellView;
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
    @observable
    public isPlaceholder = false;

    /** @internal */
    @observable
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

    private anchorChanged(): void {
        this.tabbableChildren = this.anchor ? [this.anchor] : [];
    }
}

const anchorCellView = TableColumnAnchorCellView.compose({
    baseName: 'table-column-anchor-cell-view',
    template,
    styles
});
DesignSystem.getOrCreate().withPrefix('nimble').register(anchorCellView());
export const tableColumnAnchorCellViewTag = 'nimble-table-column-anchor-cell-view';
