import { DesignSystem } from '@microsoft/fast-foundation';
import { attr } from '@microsoft/fast-element';
import { TableColumnEnumBase, TableColumnEnumColumnConfig } from '../enum-base';
import { styles } from '../enum-base/styles';
import { template } from '../enum-base/template';
import { TableColumnSortOperation, TableColumnValidity } from '../base/types';
import { mixinGroupableColumnAPI } from '../mixins/groupable-column';
import { mixinFractionalWidthColumnAPI } from '../mixins/fractional-width-column';
import { MappingText } from '../../mapping/text';
import {
    TableColumnEnumTextValidator
} from './models/table-column-enum-text-validator';
import type { ColumnInternalsOptions } from '../base/models/column-internals';
import { tableColumnEnumTextCellViewTag } from './cell-view';
import { tableColumnEnumTextGroupHeaderViewTag } from './group-header-view';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-table-column-enum-text': TableColumnEnumText;
    }
}

export interface TableColumnEnumTextColumnConfig
    extends TableColumnEnumColumnConfig {
    placeholder: string;
}

/**
 * Table column that maps values to strings
 */
export class TableColumnEnumText extends mixinGroupableColumnAPI(
    mixinFractionalWidthColumnAPI(
        TableColumnEnumBase<TableColumnEnumTextColumnConfig>
    )
) {
    @attr
    public placeholder?: string;

    protected get supportedMappingTypes(): readonly (typeof Mapping)[] {
        return [MappingText] as const;
    }

    private readonly validator: TableColumnEnumTextValidator = new TableColumnEnumTextValidator(
        this.columnInternals
    );

    public override get validity(): TableColumnValidity {
        return this.validator.getValidity();
    }

    protected override getColumnInternalsOptions(): ColumnInternalsOptions {
        return {
            cellRecordFieldNames: ['value'],
            cellViewTag: tableColumnEnumTextCellViewTag,
            groupHeaderViewTag: tableColumnEnumTextGroupHeaderViewTag,
            delegatedEvents: [],
            sortOperation: TableColumnSortOperation.basic
        };
    }

    protected override updateColumnConfig(): void {
        // this.columnInternals.columnConfig = {
        //     mappingConfigs: this.getMappingConfigsFromMappings(),
        //     placeholder: this.placeholder ?? ''
        // };
    }

    private placeholderChanged(): void {
        this.updateColumnConfig();
    }
}

const nimbleTableColumnEnumText = TableColumnEnumText.compose({
    baseName: 'table-column-enum-text',
    template,
    styles
});

DesignSystem.getOrCreate()
    .withPrefix('nimble')
    .register(nimbleTableColumnEnumText());
export const tableColumnEnumTextTag = DesignSystem.tagFor(TableColumnEnumText);
