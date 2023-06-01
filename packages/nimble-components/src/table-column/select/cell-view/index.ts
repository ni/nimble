import { DesignSystem } from '@microsoft/fast-foundation';
import type {
    TableColumnSelectCellRecord,
    TableColumnSelectColumnConfig
} from '..';
import { TableCellView } from '../../base/cell-view';
import { styles } from './styles';
import { template } from './template';
import type { TableStringFieldValue } from '../../../table/types';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-table-column-select-cell-view': TableColumnSelectCellView;
    }
}

/**
 * A cell view for displaying dropdowns
 */
export class TableColumnSelectCellView extends TableCellView<
TableColumnSelectCellRecord,
TableColumnSelectColumnConfig
> {
    public get items(): string[] {
        if (typeof this.cellRecord.items === 'string') {
            return this.cellRecord.items.split(',');
        }
        return [] as string[];
    }

    public cellSelectChanged(): void {
        const eventDetail: CellSelectEventDetail = {
            newValue: this.cellRecord['selected-item'],
            recordId: this.columnRecordId
        };
        console.log('Select change, new value = %s', eventDetail.newValue);
        this.$emit('cellchange', eventDetail);
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

export interface CellSelectEventDetail {
    newValue: TableStringFieldValue;
    recordId?: string;
}