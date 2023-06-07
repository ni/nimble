import { DesignSystem } from '@microsoft/fast-foundation';
import { css } from '@microsoft/fast-element';
import { TableCellView } from '../../base/cell-view';
import { template } from './template';
import type {
    TableColumnEnumCellRecord,
    TableColumnEnumColumnConfig
} from '../../enum-base';
import type { MappingConfigIconOrSpinner } from '../../../mapping/icon';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-table-column-icon-cell-view': TableColumnIconCellView;
    }
}

/**
 * A cell view for displaying mapped elements
 */
export class TableColumnIconCellView extends TableCellView<
TableColumnEnumCellRecord,
TableColumnEnumColumnConfig
> {
    public getMappingToRender(): MappingConfigIconOrSpinner | null {
        return this.getMatchingMapping() ?? this.getDefaultMapping();
    }

    private getMatchingMapping(): MappingConfigIconOrSpinner | null {
        const found = this.columnConfig.mappingConfigs.find(
            x => x.key === this.cellRecord.value
        );
        return (found as MappingConfigIconOrSpinner) ?? null;
    }

    private getDefaultMapping(): MappingConfigIconOrSpinner | null {
        const found = this.columnConfig.mappingConfigs.find(
            x => x.defaultMapping
        );
        return (found as MappingConfigIconOrSpinner) ?? null;
    }
}

const iconCellView = TableColumnIconCellView.compose({
    baseName: 'table-column-icon-cell-view',
    template,
    styles: css``
});
DesignSystem.getOrCreate().withPrefix('nimble').register(iconCellView());
export const tableColumnIconCellViewTag = DesignSystem.tagFor(
    TableColumnIconCellView
);
