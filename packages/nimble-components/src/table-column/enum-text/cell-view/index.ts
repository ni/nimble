import { DesignSystem } from '@microsoft/fast-foundation';
import { styles } from '../../text-base/cell-view/styles';
import { template } from '../../text-base/cell-view/template';
import type { TableColumnEnumCellRecord } from '../../enum-base';
import type { MappingConfigText } from '../../../mapping/text';
import { TableColumnTextCellViewBase } from '../../text-base/cell-view';
import type { TableColumnEnumTextColumnConfig } from '..';

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
TableColumnEnumTextColumnConfig
> {
    public override get text(): string {
        return this.mappingToRender?.label ?? '';
    }

    public override get placeholder(): string {
        return this.columnConfig.placeholder;
    }

    public override get shouldUsePlaceholder(): boolean {
        return this.mappingToRender === null;
    }

    private get mappingToRender(): MappingConfigText | null {
        return this.matchingMapping ?? this.defaultMapping;
    }

    private get matchingMapping(): MappingConfigText | null {
        const found = this.columnConfig.mappingConfigs.find(
            x => x.key === this.cellRecord.value
        );
        return (found as MappingConfigText) ?? null;
    }

    private get defaultMapping(): MappingConfigText | null {
        const found = this.columnConfig.mappingConfigs.find(
            x => x.defaultMapping
        );
        return (found as MappingConfigText) ?? null;
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
