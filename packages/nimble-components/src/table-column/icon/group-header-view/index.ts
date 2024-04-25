import { DesignSystem } from '@microsoft/fast-foundation';
import { ViewTemplate, observable } from '@microsoft/fast-element';
import { styles } from './styles';
import { template } from './template';
import type { TableColumnEnumColumnConfig } from '../../enum-base';
import type { TableFieldValue } from '../../../table/types';
import { TableColumnTextGroupHeaderViewBase } from '../../text-base/group-header-view';
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

declare global {
    interface HTMLElementTagNameMap {
        'nimble-table-column-icon-group-header-view': TableColumnIconGroupHeaderView;
    }
}

/**
 * The group header view for the icon column
 */
export class TableColumnIconGroupHeaderView
    extends TableColumnTextGroupHeaderViewBase<
    TableFieldValue,
    TableColumnEnumColumnConfig
    >
    implements IconView, SpinnerView {
    @observable
    public severity: IconSeverity;

    @observable
    public visualizationTemplate?:
    | ViewTemplate<IconView>
    | ViewTemplate<SpinnerView>;

    public readonly textHidden = false;

    protected updateText(): void {
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

const iconGroupHeaderView = TableColumnIconGroupHeaderView.compose({
    baseName: 'table-column-icon-group-header-view',
    template,
    styles
});
DesignSystem.getOrCreate().withPrefix('nimble').register(iconGroupHeaderView());
export const tableColumnIconGroupHeaderViewTag = 'nimble-table-column-icon-group-header-view';
