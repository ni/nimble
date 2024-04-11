import { DesignSystem } from '@microsoft/fast-foundation';
import { ViewTemplate, observable } from '@microsoft/fast-element';
import { TableCellView } from '../../base/cell-view';
import { styles } from './styles';
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
import {
    MappingSpinnerConfig,
    SpinnerView
} from '../../enum-base/models/mapping-spinner-config';

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
    implements IconView, SpinnerView {
    @observable
    public severity: IconSeverity;

    @observable
    public text?: string;

    @observable
    public iconTemplate?: ViewTemplate<IconView> | ViewTemplate<SpinnerView>;

    @observable
    public visual?: 'spinner' | 'icon';

    @observable
    public textHidden = false;

    /** @internal */
    @observable
    public hasOverflow = false;

    private columnConfigChanged(): void {
        this.updateState();
    }

    private cellRecordChanged(): void {
        this.updateState();
    }

    private updateState(): void {
        this.visual = undefined;
        if (!this.columnConfig || !this.cellRecord) {
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
            this.iconTemplate = mappingConfig.iconCellTemplate;
            this.textHidden = mappingConfig.textHidden;
        } else if (mappingConfig instanceof MappingSpinnerConfig) {
            this.visual = 'spinner';
            this.text = mappingConfig.text;
            this.iconTemplate = mappingConfig.spinnerCellTemplate;
            this.textHidden = mappingConfig.textHidden;
        }
    }
}

const iconCellView = TableColumnIconCellView.compose({
    baseName: 'table-column-icon-cell-view',
    template,
    styles
});
DesignSystem.getOrCreate().withPrefix('nimble').register(iconCellView());
export const tableColumnIconCellViewTag = 'nimble-table-column-icon-cell-view';
