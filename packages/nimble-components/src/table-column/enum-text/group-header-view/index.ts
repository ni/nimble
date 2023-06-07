import { DesignSystem } from '@microsoft/fast-foundation';
import { observable } from '@microsoft/fast-element';
import { TableGroupHeaderView } from '../../base/group-header-view';
import { styles } from './styles';
import { template } from './template';
import type { ConvertedKeyMappingForIconColumn } from '../../../mapping/icon';
import type { TableColumnEnumColumnConfig } from '../../enum-base';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-table-column-enum-text-group-header-view': TableColumnEnumTextGroupHeaderView;
    }
}

/**
 * A group header view for enum columns
 */
export class TableColumnEnumTextGroupHeaderView extends TableGroupHeaderView<
string | number | boolean | null | undefined,
TableColumnEnumColumnConfig
> {
    /** @internal */
    public span: HTMLSpanElement | null = null;

    /** @internal */
    @observable
    public isValidContentAndHasOverflow = false;

    public getMappingToRender(): ConvertedKeyMappingForIconColumn | null {
        const found = this.columnConfig?.convertedKeyMappings.find(
            x => x.key === this.groupHeaderValue
        );
        return found as ConvertedKeyMappingForIconColumn ?? null;
    }
}

const enumTextGroupHeaderView = TableColumnEnumTextGroupHeaderView.compose({
    baseName: 'table-column-icon-group-header-view',
    template,
    styles
});
DesignSystem.getOrCreate()
    .withPrefix('nimble')
    .register(enumTextGroupHeaderView());
export const tableColumnEnumTextGroupHeaderViewTag = DesignSystem.tagFor(
    TableColumnEnumTextGroupHeaderView
);
