import { DesignSystem } from '@microsoft/fast-foundation';
import type { TableColumnEnumColumnConfig } from '..';
import { TableGroupHeaderView } from '../../base/group-header-view';
import type { Mapping } from '../../../mapping/base';
import { styles } from './styles';
import { template } from './template';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-table-column-enum-group-header-view': TableColumnEnumGroupHeaderView;
    }
}

/**
 * A group header view for enum columns
 */
export class TableColumnEnumGroupHeaderView extends TableGroupHeaderView<
string | number | boolean | null | undefined,
TableColumnEnumColumnConfig
> {
    public getMappingToRender(): Mapping | null {
        const found = this.columnConfig?.typedKeysToMappings.find(
            x => x[0] === this.groupHeaderValue
        );
        return found ? found[1] : null;
    }
}

const enumGroupHeaderView = TableColumnEnumGroupHeaderView.compose({
    baseName: 'table-column-enum-group-header-view',
    template,
    styles
});
DesignSystem.getOrCreate()
    .withPrefix('nimble')
    .register(enumGroupHeaderView());
export const tableColumnEnumGroupHeaderViewTag = DesignSystem.tagFor(
    TableColumnEnumGroupHeaderView
);
