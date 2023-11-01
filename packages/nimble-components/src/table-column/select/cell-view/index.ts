import { observable, volatile } from '@microsoft/fast-element';
import { DesignSystem } from '@microsoft/fast-foundation';
import type {
    TableColumnSelectCellRecord,
    TableColumnSelectColumnConfig
} from '..';
import type { Select } from '../../../select';
import { TableCellView } from '../../base/cell-view';
import { styles } from './styles';
import { template } from './template';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-table-column-select-cell-view': TableColumnSelectCellView;
    }
}

/**
 * A cell view for displaying links
 */
export class TableColumnSelectCellView extends TableCellView<
TableColumnSelectCellRecord,
TableColumnSelectColumnConfig
> {
    /** @internal */
    @observable
    public hasOverflow = false;

    /** @internal */
    public select?: Select;

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
        this.select?.blur();
    }
}

const selectCellView = TableColumnSelectCellView.compose({
    baseName: 'table-column-select-cell-view',
    template,
    styles
});
DesignSystem.getOrCreate().withPrefix('nimble').register(selectCellView());
export const tableColumnSelectCellViewTag = DesignSystem.tagFor(
    TableColumnSelectCellView
);
