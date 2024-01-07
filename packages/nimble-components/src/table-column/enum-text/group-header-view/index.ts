import { DesignSystem } from '@microsoft/fast-foundation';
import { styles } from '../../text-base/group-header-view/styles';
import { template } from '../../text-base/group-header-view/template';
import type { TableColumnEnumColumnConfig } from '../../enum-base';
import { TableColumnTextGroupHeaderViewBase } from '../../text-base/group-header-view';
import type { TableFieldValue } from '../../../table/types';
import { MappingTextConfig } from '../../enum-base/models/mapping-text-config';

export const tableColumnEnumTextGroupHeaderViewTag = 'nimble-table-column-enum-text-group-header-view';
declare global {
    interface HTMLElementTagNameMap {
        [tableColumnEnumTextGroupHeaderViewTag]: TableColumnEnumTextGroupHeaderView;
    }
}

/**
 * A group header view for enum columns
 */
export class TableColumnEnumTextGroupHeaderView extends TableColumnTextGroupHeaderViewBase<
TableFieldValue,
TableColumnEnumColumnConfig
> {
    private columnConfigChanged(): void {
        this.updateText();
    }

    private groupHeaderValueChanged(): void {
        this.updateText();
    }

    private updateText(): void {
        const value = this.groupHeaderValue;
        if (value === undefined || value === null) {
            this.text = '';
            return;
        }

        const config = this.columnConfig?.mappingConfigs.get(value);
        this.text = config instanceof MappingTextConfig && config.text
            ? config.text
            : '';
    }
}

const enumTextGroupHeaderView = TableColumnEnumTextGroupHeaderView.compose({
    baseName: tableColumnEnumTextGroupHeaderViewTag,
    template,
    styles
});
DesignSystem.getOrCreate()
    .register(enumTextGroupHeaderView());
