import { DesignSystem } from '@microsoft/fast-foundation';
import { observable } from '@microsoft/fast-element';
import { TableCellView } from '../../base/cell-view';
import { styles } from './styles';
import { template } from './template';
import type { TableColumnEnumCellRecord, TableColumnEnumColumnConfig } from '../../enum-base';
import type { ConvertedKeyMappingText } from '../../../mapping/text';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-table-column-enum-text-cell-view': TableColumnEnumTextCellView;
    }
}

/**
 * A cell view for displaying mapped elements
 */
export class TableColumnEnumTextCellView extends TableCellView<
TableColumnEnumCellRecord,
TableColumnEnumColumnConfig
> {
    /** @internal */
    public span: HTMLSpanElement | null = null;

    /** @internal */
    @observable
    public isValidContentAndHasOverflow = false;

    public getMappingToRender(): ConvertedKeyMappingText | null {
        return this.getMatchingMapping() ?? this.getDefaultMapping();
    }

    private getMatchingMapping(): ConvertedKeyMappingText | null {
        const found = this.columnConfig.convertedKeyMappings.find(
            x => x.key === this.cellRecord.value
        );
        return found as ConvertedKeyMappingText ?? null;
    }

    private getDefaultMapping(): ConvertedKeyMappingText | null {
        const found = this.columnConfig.convertedKeyMappings.find(
            x => x.defaultMapping
        );
        return found as ConvertedKeyMappingText ?? null;
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
