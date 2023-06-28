import { DesignSystem } from '@microsoft/fast-foundation';
import { TableCellView } from '../../base/cell-view';
import { template } from './template';
import type {
    TableColumnEnumCellRecord,
    TableColumnEnumColumnConfig
} from '../../enum-base';
import type { MappingConfigIconBase } from '../../../mapping/icon-base/types';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-table-column-icon-cell-view': TableColumnIconCellView;
    }
}

/**
 * The cell view for the icon column
 */
export class TableColumnIconCellView extends TableCellView<
TableColumnEnumCellRecord,
TableColumnEnumColumnConfig
> {
    public get mappingToRender(): MappingConfigIconBase | null {
        return this.matchingMapping ?? this.defaultMapping;
    }

    private get matchingMapping(): MappingConfigIconBase | null {
        const found = this.columnConfig.mappingConfigs.find(
            x => x.key === this.cellRecord.value
        );
        return (found as MappingConfigIconBase) ?? null;
    }

    private get defaultMapping(): MappingConfigIconBase | null {
        const found = this.columnConfig.mappingConfigs.find(
            x => x.defaultMapping
        );
        return (found as MappingConfigIconBase) ?? null;
    }
}

const iconCellView = TableColumnIconCellView.compose({
    baseName: 'table-column-icon-cell-view',
    template
});
DesignSystem.getOrCreate().withPrefix('nimble').register(iconCellView());
export const tableColumnIconCellViewTag = DesignSystem.tagFor(
    TableColumnIconCellView
);
