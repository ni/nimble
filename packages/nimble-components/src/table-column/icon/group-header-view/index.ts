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
import { MappingSpinnerConfig } from '../../enum-base/models/mapping-spinner-config';

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
    implements IconView {
    public severity: IconSeverity;
    @observable
    public iconTemplate?: ViewTemplate<IconView>;

    private columnConfigChanged(): void {
        this.updateState();
    }

    private groupHeaderValueChanged(): void {
        this.updateState();
    }

    private updateState(): void {
        this.iconTemplate = undefined;
        if (!this.columnConfig) {
            return;
        }
        const value = this.groupHeaderValue;
        if (value === undefined || value === null) {
            return;
        }
        const mappingConfig = this.columnConfig.mappingConfigs.get(value);
        if (mappingConfig instanceof MappingIconConfig) {
            this.severity = mappingConfig.severity;
            this.text = mappingConfig.text;
            this.iconTemplate = mappingConfig.iconTemplate;
        } else if (mappingConfig instanceof MappingSpinnerConfig) {
            this.text = mappingConfig.text;
        }
    }
}

const iconGroupHeaderView = TableColumnIconGroupHeaderView.compose({
    baseName: 'table-column-icon-group-header-view',
    template,
    styles
});
DesignSystem.getOrCreate().withPrefix('nimble').register(iconGroupHeaderView());
export const tableColumnIconGroupHeaderViewTag = DesignSystem.tagFor(
    TableColumnIconGroupHeaderView
);
