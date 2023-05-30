import { DesignSystem } from '@microsoft/fast-foundation';
import type {
    TableColumnMappingCellRecord,
    TableColumnMappingColumnConfig
} from '..';
import { TableCellView } from '../../base/cell-view';
import type { Mapping } from '../mappings';
import { styles } from './styles';
import { template } from './template';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-table-column-mapping-cell-view': TableColumnMappingCellView;
    }
}

/**
 * A cell view for displaying mapped elements
 */
export class TableColumnMappingCellView extends TableCellView<
TableColumnMappingCellRecord,
TableColumnMappingColumnConfig
> {
    public getMappingToRender(): Mapping | null {
        return this.getMatchingMapping() ?? this.getDefaultMapping();
    }

    private getMatchingMapping(): Mapping | null {
        const found = this.columnConfig.typedKeysToMappings.find(
            x => x[0] === this.cellRecord.value
        );
        return found ? found[1] : null;
    }

    private getDefaultMapping(): Mapping | null {
        const found = this.columnConfig.typedKeysToMappings.find(
            x => x[1].defaultMapping
        );
        return found ? found[1] : null;
    }
}

const mappingCellView = TableColumnMappingCellView.compose({
    baseName: 'table-column-mapping-cell-view',
    template,
    styles
});
DesignSystem.getOrCreate().withPrefix('nimble').register(mappingCellView());
export const tableColumnMappingCellViewTag = DesignSystem.tagFor(
    TableColumnMappingCellView
);
