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
import { IconSeverity } from '../../../icon-base/types';
import {
    MappingSpinnerConfig,
    SpinnerView
} from '../../enum-base/models/mapping-spinner-config';
import { MappingTextConfig } from '../../enum-base/models/mapping-text-config';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-table-column-mapping-cell-view': TableColumnMappingCellView;
    }
}

/**
 * The cell view for the mapping column
 */
export class TableColumnMappingCellView
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
    public visualizationTemplate?:
    | ViewTemplate<IconView>
    | ViewTemplate<SpinnerView>;

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
        this.resetState();

        if (!this.columnConfig || !this.cellRecord) {
            return;
        }
        const value = this.cellRecord.value;
        if (value === undefined || value === null) {
            return;
        }
        const mappingConfig = this.columnConfig.mappingConfigs.get(value);
        if (mappingConfig instanceof MappingIconConfig) {
            this.severity = mappingConfig.severity;
            this.text = mappingConfig.text;
            this.visualizationTemplate = mappingConfig.iconTemplate;
            this.textHidden = mappingConfig.textHidden;
        } else if (mappingConfig instanceof MappingSpinnerConfig) {
            this.text = mappingConfig.text;
            this.visualizationTemplate = mappingConfig.spinnerTemplate;
            this.textHidden = mappingConfig.textHidden;
        } else if (mappingConfig instanceof MappingTextConfig) {
            this.text = mappingConfig.text;
            this.textHidden = false;
        }
    }

    private resetState(): void {
        this.text = undefined;
        this.textHidden = false;
        this.visualizationTemplate = undefined;
        this.severity = IconSeverity.default;
    }
}

const mappingCellView = TableColumnMappingCellView.compose({
    baseName: 'table-column-mapping-cell-view',
    template,
    styles
});
DesignSystem.getOrCreate().withPrefix('nimble').register(mappingCellView());
export const tableColumnMappingCellViewTag = 'nimble-table-column-mapping-cell-view';
