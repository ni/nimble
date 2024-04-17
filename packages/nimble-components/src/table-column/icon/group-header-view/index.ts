import { DesignSystem } from '@microsoft/fast-foundation';
import { ViewTemplate, observable } from '@microsoft/fast-element';
import { styles } from './styles';
import { template } from './template';
import type { TableColumnEnumColumnConfig } from '../../enum-base';
import type { TableFieldValue } from '../../../table/types';
import { TableColumnTextGroupHeaderViewBase } from '../../text-base/group-header-view';
import type { IconSeverity } from '../../../icon-base/types';
import {
    MappingIconConfig,
    type IconView
} from '../../enum-base/models/mapping-icon-config';
import {
    MappingSpinnerConfig,
    SpinnerView
} from '../../enum-base/models/mapping-spinner-config';

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
        this.visualizationTemplate = undefined;
        if (!this.columnConfig) {
            this.text = '';
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
        }
    }
}

const iconGroupHeaderView = TableColumnIconGroupHeaderView.compose({
    baseName: 'table-column-icon-group-header-view',
    template,
    styles
});
DesignSystem.getOrCreate().withPrefix('nimble').register(iconGroupHeaderView());
export const tableColumnIconGroupHeaderViewTag = 'nimble-table-column-icon-group-header-view';
