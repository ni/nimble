import { DesignSystem } from '@microsoft/fast-foundation';
import { styles } from './styles';
import { template } from './template';
import type { TableColumnEnumColumnConfig } from '../../enum-base';
import type { TableFieldValue } from '../../../table/types';
import { TableColumnTextGroupHeaderViewBase } from '../../text-base/group-header-view';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-table-column-icon-group-header-view': TableColumnIconGroupHeaderView;
    }
}

/**
 * The group header view for the icon column
 */
export class TableColumnIconGroupHeaderView extends TableColumnTextGroupHeaderViewBase<
TableFieldValue,
TableColumnEnumColumnConfig
> {
    public get mappingToRender(): null {
        // const found = this.columnConfig?.mappingConfigs.find(
        //     x => x.key === this.groupHeaderValue
        // );
        // return (found as MappingConfigIconBase) ?? null;
        return null;
    }

    public override get text(): string {
        // return (
        //     this.mappingToRender?.label
        //     ?? this.groupHeaderValue?.toString()
        //     ?? ''
        // );
        return '';
    }

    public override get placeholder(): string {
        throw Error('Placeholder not used');
    }

    // TODO I don't get this, a default mapping is optional right? So what happens when a value does not have a mapping?
    // Rule incorrectly reports an error when overriding base class member
    // eslint-disable-next-line @typescript-eslint/class-literal-property-style
    public override get shouldUsePlaceholder(): boolean {
        return false;
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
