import { DesignSystem } from '@microsoft/fast-foundation';
import { observable } from '@microsoft/fast-element';
import { styles } from '../../text-base/group-header-view/styles';
import { template } from './template';
import type { MappingConfigText } from '../../../mapping/text';
import type { TableColumnEnumColumnConfig } from '../../enum-base';
import { TableColumnTextGroupHeaderViewBase } from '../../text-base/group-header-view';
import type { TableFieldValue } from '../../../table/types';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-table-column-enum-text-group-header-view': TableColumnEnumTextGroupHeaderView;
    }
}

/**
 * A group header view for enum columns
 */
export class TableColumnEnumTextGroupHeaderView extends TableColumnTextGroupHeaderViewBase<
TableFieldValue,
TableColumnEnumColumnConfig
> {
    /** @internal */
    public span: HTMLSpanElement | null = null;

    /** @internal */
    @observable
    public isValidContentAndHasOverflow = false;

    public get mappingToRender(): MappingConfigText | null {
        const found = this.columnConfig?.mappingConfigs.find(
            x => x.key === this.groupHeaderValue
        );
        return (found as MappingConfigText) ?? null;
    }

    public override get text(): string {
        return this.mappingToRender?.label ?? '';
    }

    public override get placeholder(): string {
        throw Error('Placeholder not used');
    }

    // Rule incorrectly reports an error when overriding base class member
    // eslint-disable-next-line @typescript-eslint/class-literal-property-style
    public override get shouldUsePlaceholder(): boolean {
        return false;
    }
}

const enumTextGroupHeaderView = TableColumnEnumTextGroupHeaderView.compose({
    baseName: 'table-column-enum-text-group-header-view',
    template,
    styles
});
DesignSystem.getOrCreate()
    .withPrefix('nimble')
    .register(enumTextGroupHeaderView());
export const tableColumnEnumTextGroupHeaderViewTag = DesignSystem.tagFor(
    TableColumnEnumTextGroupHeaderView
);
