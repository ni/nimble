import { DesignSystem } from '@microsoft/fast-foundation';
import { styles } from '../../text-base/cell-view/styles';
import { template } from '../../text-base/cell-view/template';
import type {
    TableColumnEnumCellRecord,
    TableColumnEnumColumnConfig
} from '../../enum-base';
import type { ConvertedKeyMappingText } from '../../../mapping/text';
import { TableColumnTextCellViewBase } from '../../text-base/cell-view';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-table-column-enum-text-cell-view': TableColumnEnumTextCellView;
    }
}

/**
 * A cell view for displaying mapped text
 */
export class TableColumnEnumTextCellView extends TableColumnTextCellViewBase<
TableColumnEnumCellRecord,
TableColumnEnumColumnConfig
> {
    public override get text(): string {
        return this.getMappingToRender()?.label ?? '';
    }

    public override get placeholder(): string {
        throw Error('Unexpected member access');
    }

    // Overriding base class member
    // eslint-disable-next-line @typescript-eslint/class-literal-property-style
    public override get shouldUsePlaceholder(): boolean {
        return false;
    }

    private getMappingToRender(): ConvertedKeyMappingText | null {
        return this.getMatchingMapping() ?? this.getDefaultMapping();
    }

    private getMatchingMapping(): ConvertedKeyMappingText | null {
        const found = this.columnConfig.convertedKeyMappings.find(
            x => x.key === this.cellRecord.value
        );
        return (found as ConvertedKeyMappingText) ?? null;
    }

    private getDefaultMapping(): ConvertedKeyMappingText | null {
        const found = this.columnConfig.convertedKeyMappings.find(
            x => x.defaultMapping
        );
        return (found as ConvertedKeyMappingText) ?? null;
    }
}

const enumTextCellView = TableColumnEnumTextCellView.compose({
    baseName: 'table-column-enum-text-cell-view',
    template,
    styles
});
DesignSystem.getOrCreate().withPrefix('nimble').register(enumTextCellView());
export const tableColumnEnumTextCellViewTag = DesignSystem.tagFor(
    TableColumnEnumTextCellView
);
