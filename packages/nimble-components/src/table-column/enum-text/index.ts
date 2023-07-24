import { DesignSystem } from '@microsoft/fast-foundation';
import { attr } from '@microsoft/fast-element';
import { TableColumnEnumBase, TableColumnEnumColumnConfig } from '../enum-base';
import { styles } from '../enum-base/styles';
import { template } from '../enum-base/template';
import { TableColumnSortOperation, TableColumnValidity } from '../base/types';
import { mixinGroupableColumnAPI } from '../mixins/groupable-column';
import { mixinFractionalWidthColumnAPI } from '../mixins/fractional-width-column';
import { MappingText } from '../../mapping/text';
import { TableColumnEnumTextValidator } from './models/table-column-enum-text-validator';
import type { ColumnInternalsOptions } from '../base/models/column-internals';
import { tableColumnEnumTextCellViewTag } from './cell-view';
import { tableColumnEnumTextGroupHeaderViewTag } from './group-header-view';
import type { Mapping } from '../../mapping/base';
import type { MappingConfig } from '../enum-base/models/mapping-config';
import { MappingTextConfig } from '../enum-base/models/mapping-text-config';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-table-column-enum-text': TableColumnEnumText;
    }
}

/**
 * Table column that maps values to strings
 */
export class TableColumnEnumText extends mixinGroupableColumnAPI(
    mixinFractionalWidthColumnAPI(
        TableColumnEnumBase<
        TableColumnEnumColumnConfig,
        TableColumnEnumTextValidator
        >
    )
) {
    protected get supportedMappingElements(): readonly (typeof Mapping)[] {
        return [MappingText] as const;
    }

    public override createValidator(): TableColumnEnumTextValidator {
        return new TableColumnEnumTextValidator(this.columnInternals);
    }

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
        this.validator.validate(
            this.supportedMappingElements,
            this.mappings,
            this.keyType
        );
        this.columnInternals.columnConfig = this.validator.isValid()
            ? this.createColumnConfig()
            : undefined;
    }

    protected createMappingConfig(mapping: Mapping): MappingConfig {
        if (mapping instanceof MappingText) {
            return new MappingTextConfig(mapping.label!);
        }
        // TODO just throwing an error mere seems wrong, nothing to catch it or report to users.
        throw new Error('Unsupported mapping');
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
