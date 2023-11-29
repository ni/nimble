import { DesignSystem } from '@microsoft/fast-foundation';
import type {
    TableColumnEnumCellRecord,
    TableColumnEnumColumnConfig
} from '../../enum-base';
import { TableColumnTextCellViewBase } from '../../text-base/cell-view';
import { MappingTextConfig } from '../../enum-base/models/mapping-text-config';

/**
 * A cell view for displaying mapped text
 */
export class TableColumnEnumTextCellView extends TableColumnTextCellViewBase<
TableColumnEnumCellRecord,
TableColumnEnumColumnConfig
> {
    private columnConfigChanged(): void {
        this.updateText();
    }

    private cellRecordChanged(): void {
        this.updateText();
    }

    private updateText(): void {
        const value = this.cellRecord?.value;
        if (value === undefined || value === null) {
            this.text = '';
            return;
        }

        const config = this.columnConfig?.mappingConfigs.get(value);
        this.text = config instanceof MappingTextConfig && config.text
            ? config.text
            : '';
    }
}

export const tableColumnEnumTextCellViewTag = DesignSystem.tagFor(
    TableColumnEnumTextCellView
);
