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
 * A cell view for displaying nimble-select
 */
export class TableColumnSelectCellView extends TableCellView<
TableColumnSelectCellRecord,
TableColumnSelectColumnConfig
> {
    /** @internal */
    public select?: Select;
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
