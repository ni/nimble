import { DesignSystem } from '@microsoft/fast-foundation';
import { TableCellView } from '../../base/cell-view';
import { template } from './template';
import type {
    TableColumnEnumCellRecord,
    TableColumnEnumColumnConfig
} from '../../enum-base';
import { MappingIconConfig } from '../../enum-base/models/mapping-icon-config';
import type { IconSeverity } from '../../../icon-base/types';

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
    public severity: IconSeverity;
    public label = '';
    public iconTemplate?

    private columnConfigChanged(): void {
        this.updateState();
    }

    private cellRecordChanged(): void {
        this.updateState();
    }

    private updateState(): void {
        const value = this.cellRecord.value;
        if (value !== undefined && value !== null) {
            const mappingConfig = this.columnConfig.mappingConfigs.get(value);
            if (mappingConfig instanceof MappingIconConfig) {
                this.severity = mappingConfig.severity;
                this.label = mappingConfig.label;
            }
        }
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
