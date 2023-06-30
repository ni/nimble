import { DesignSystem } from '@microsoft/fast-foundation';
import { styles } from '../../text-base/cell-view/styles';
import { template } from '../../text-base/cell-view/template';
import type { TableColumnEnumCellRecord } from '../../enum-base';
import { TableColumnTextCellViewBase } from '../../text-base/cell-view';
import type { TableColumnEnumTextColumnConfig } from '..';
import type { MappingTextConfig } from '../../enum-base/models/mapping-text-config';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-table-column-enum-text-cell-view': TableColumnEnumTextCellView;
    }
}

/**
 * A cell view for displaying mapped text
 */
export class TableColumnEnumTextCellView extends TableColumnTextCellViewBase<
TableColumnEnumCellRecord,
TableColumnEnumTextColumnConfig
> {
    private columnConfigChanged(): void {
        this.placeholder = this.columnConfig.placeholder || '';

        const value = this.cellRecord.value;
        if (value === undefined || value === null) {
            this.shouldUsePlaceholder = true;
            return;
        }

        const config = this.columnConfig.mappingConfigs.get(value) ?? this.columnConfig.defaultMapping;
        if (config) {
            this.shouldUsePlaceholder = false;
            this.text = (config as MappingTextConfig).label;
        }
    }
}

const enumTextCellView = TableColumnEnumTextCellView.compose({
    baseName: 'table-column-enum-text-cell-view',
    template,
    styles
});
DesignSystem.getOrCreate().withPrefix('nimble').register(enumTextCellView());
export const tableColumnEnumTextCellViewTag = DesignSystem.tagFor(
    TableColumnEnumTextCellView
);
