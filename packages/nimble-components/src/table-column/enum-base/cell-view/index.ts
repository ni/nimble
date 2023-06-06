import { DesignSystem } from '@microsoft/fast-foundation';
import type {
    ConvertedKeyMapping,
    TableColumnEnumCellRecord,
    TableColumnEnumColumnConfig
} from '..';
import { TableCellView } from '../../base/cell-view';
import { styles } from './styles';
import { template } from './template';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-table-column-enum-cell-view': TableColumnEnumCellView;
    }
}

/**
 * A cell view for displaying mapped elements
 */
export class TableColumnEnumCellView extends TableCellView<
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

const enumCellView = TableColumnEnumCellView.compose({
    baseName: 'table-column-mapping-cell-view',
    template,
    styles
});
DesignSystem.getOrCreate().withPrefix('nimble').register(enumCellView());
export const tableColumnEnumCellViewTag = DesignSystem.tagFor(
    TableColumnEnumCellView
);
