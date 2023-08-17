import { DesignSystem } from '@microsoft/fast-foundation';
import { ViewTemplate, observable } from '@microsoft/fast-element';
import { TableCellView } from '../../base/cell-view';
import { template } from './template';
import type {
    TableColumnEnumCellRecord,
    TableColumnEnumColumnConfig
} from '../../enum-base';
import {
    IconView,
    MappingIconConfig
} from '../../enum-base/models/mapping-icon-config';
import type { IconSeverity } from '../../../icon-base/types';
import { MappingSpinnerConfig } from '../../enum-base/models/mapping-spinner-config';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-table-column-icon-cell-view': TableColumnIconCellView;
    }
}

/**
 * The cell view for the icon column
 */
export class TableColumnIconCellView
    extends TableCellView<
    TableColumnEnumCellRecord,
    TableColumnEnumColumnConfig
    >
    implements IconView {
    @observable
    public severity: IconSeverity;

    @observable
    public text?: string;

    @observable
    public iconTemplate?: ViewTemplate<IconView>;

    @observable
    public visual?: 'spinner' | 'icon';

    private columnConfigChanged(): void {
        this.updateState();
    }

    private cellRecordChanged(): void {
        this.updateState();
    }

    private updateState(): void {
        this.visual = undefined;
        if (!this.columnConfig?.mappingConfigs || !this.cellRecord) {
            return;
        }
        const value = this.cellRecord.value;
        if (value === undefined || value === null) {
            return;
        }
        const mappingConfig = this.columnConfig.mappingConfigs.get(value);
        if (mappingConfig instanceof MappingIconConfig) {
            this.visual = 'icon';
            this.severity = mappingConfig.severity;
            this.text = mappingConfig.text;
            this.iconTemplate = mappingConfig.iconTemplate;
        } else if (mappingConfig instanceof MappingSpinnerConfig) {
            this.visual = 'spinner';
            this.text = mappingConfig.text;
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
