import { DesignSystem } from '@microsoft/fast-foundation';
import { ViewTemplate, observable } from '@microsoft/fast-element';
import { styles } from './styles';
import { template } from './template';
import type { TableColumnEnumColumnConfig } from '../../enum-base';
import type { TableFieldValue } from '../../../table/types';
import { IconSeverity } from '../../../icon-base/types';
import {
    MappingIconConfig,
    type IconView
} from '../../enum-base/models/mapping-icon-config';
import {
    MappingSpinnerConfig,
    SpinnerView
} from '../../enum-base/models/mapping-spinner-config';
import { MappingTextConfig } from '../../enum-base/models/mapping-text-config';
import { MappingEmptyConfig } from '../../enum-base/models/mapping-empty-config';
import { TableGroupHeaderView } from '../../base/group-header-view';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-table-column-mapping-group-header-view': TableColumnMappingGroupHeaderView;
    }
}

/**
 * The group header view for the mapping column
 */
export class TableColumnMappingGroupHeaderView
    extends TableGroupHeaderView<TableFieldValue, TableColumnEnumColumnConfig>
    implements IconView, SpinnerView {
    /** @internal */
    @observable
    public hasOverflow = false;

    @observable
    public text = '';

    @observable
    public severity: IconSeverity;

    @observable
    public visualizationTemplate?:
    | ViewTemplate<IconView>
    | ViewTemplate<SpinnerView>;

    public readonly textHidden = false;

    private columnConfigChanged(): void {
        this.updateState();
    }

    private groupHeaderValueChanged(): void {
        this.updateState();
    }

    private updateState(): void {
        this.resetState();

        if (!this.columnConfig) {
            return;
        }
        const value = this.groupHeaderValue;
        const mappingConfig = this.columnConfig.mappingConfigs.get(value!);
        if (mappingConfig instanceof MappingIconConfig) {
            this.severity = mappingConfig.severity;
            this.text = mappingConfig.text ?? '';
            this.visualizationTemplate = mappingConfig.iconTemplate;
        } else if (mappingConfig instanceof MappingSpinnerConfig) {
            this.text = mappingConfig.text ?? '';
            this.visualizationTemplate = mappingConfig.spinnerTemplate;
        } else if (mappingConfig instanceof MappingTextConfig) {
            this.text = mappingConfig.text ?? '';
        } else if (mappingConfig instanceof MappingEmptyConfig) {
            this.text = mappingConfig.text ?? '';
        }
    }

    private resetState(): void {
        this.text = '';
        this.visualizationTemplate = undefined;
        this.severity = IconSeverity.default;
    }
}

const mappingGroupHeaderView = TableColumnMappingGroupHeaderView.compose({
    baseName: 'table-column-mapping-group-header-view',
    template,
    styles
});
DesignSystem.getOrCreate()
    .withPrefix('nimble')
    .register(mappingGroupHeaderView());
export const tableColumnMappingGroupHeaderViewTag = 'nimble-table-column-mapping-group-header-view';
