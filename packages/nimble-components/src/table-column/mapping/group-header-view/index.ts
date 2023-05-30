import { DesignSystem } from '@microsoft/fast-foundation';
import type { TableColumnMappingColumnConfig } from '..';
import { TableGroupHeaderView } from '../../base/group-header-view';
import type { Mapping } from '../mappings';
import { styles } from './styles';
import { template } from './template';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-table-column-mapping-group-header-view': TableColumnMappingGroupHeaderView;
    }
}

/**
 * A group header view for mapping columns
 */
export class TableColumnMappingGroupHeaderView extends TableGroupHeaderView<
string | number | boolean | null | undefined,
TableColumnMappingColumnConfig
> {
    public getMappingToRender(): Mapping | null {
        const found = this.columnConfig?.typedKeysToMappings.find(
            x => x[0] === this.groupHeaderValue
        );
        return found ? found[1] : null;
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
export const tableColumnMappingGroupHeaderViewTag = DesignSystem.tagFor(
    TableColumnMappingGroupHeaderView
);
