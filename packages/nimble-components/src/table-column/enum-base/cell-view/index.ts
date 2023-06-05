import { DesignSystem } from '@microsoft/fast-foundation';
import type {
    TableColumnEnumCellRecord,
    TableColumnEnumColumnConfig
} from '..';
import { TableCellView } from '../../base/cell-view';
import type { Mapping } from '../../../mapping/base';
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

const enumCellView = TableColumnEnumCellView.compose({
    baseName: 'table-column-mapping-cell-view',
    template,
    styles
});
DesignSystem.getOrCreate().withPrefix('nimble').register(enumCellView());
export const tableColumnEnumCellViewTag = DesignSystem.tagFor(
    TableColumnEnumCellView
);
