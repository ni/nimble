import { DesignSystem } from '@microsoft/fast-foundation';
import { observable } from '@microsoft/fast-element';
import { TableGroupHeaderView } from '../../base/group-header-view';
import { styles } from './styles';
import { template } from './template';
import type { ConvertedKeyMappingForIconColumn } from '../../../mapping/icon';
import type { TableColumnEnumColumnConfig } from '../../enum-base';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-table-column-icon-group-header-view': TableColumnIconGroupHeaderView;
    }
}

/**
 * A group header view for enum columns
 */
export class TableColumnIconGroupHeaderView extends TableGroupHeaderView<
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
        return (found as ConvertedKeyMappingForIconColumn) ?? null;
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
