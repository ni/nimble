import { DesignSystem } from '@microsoft/fast-foundation';
import { TableCellView } from '../../base/cell-view';
import { styles } from './styles';
import { template } from './template';
import type {
    ConvertedKeyMapping,
    TableColumnEnumCellRecord,
    TableColumnEnumColumnConfig
} from '../../enum-base';

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
    public getMappingToRender(): ConvertedKeyMapping | null {
        return this.getMatchingMapping() ?? this.getDefaultMapping();
    }

    private getMatchingMapping(): ConvertedKeyMapping | null {
        const found = this.columnConfig.convertedKeyMappings.find(
            x => x.key === this.cellRecord.value
        );
        return found ?? null;
    }

    private getDefaultMapping(): ConvertedKeyMapping | null {
        const found = this.columnConfig.convertedKeyMappings.find(
            x => x.defaultMapping
        );
        return found ?? null;
    }
}

const iconCellView = TableColumnIconCellView.compose({
    baseName: 'table-column-icon-cell-view',
    template,
    styles
});
DesignSystem.getOrCreate().withPrefix('nimble').register(iconCellView());
export const tableColumnIconCellViewTag = DesignSystem.tagFor(
    TableColumnIconCellView
);
