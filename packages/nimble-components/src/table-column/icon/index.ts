import { DesignSystem } from '@microsoft/fast-foundation';
import { TableColumnEnumBase, TableColumnEnumColumnConfig } from '../enum-base';
import { styles } from '../enum-base/styles';
import { template } from '../enum-base/template';
import { TableColumnSortOperation, TableColumnValidity } from '../base/types';
import { mixinGroupableColumnAPI } from '../mixins/groupable-column';
import { mixinFixedWidthColumnAPI } from '../mixins/fixed-width-column';
import { MappingSpinner } from '../../mapping/spinner';
import { MappingIcon } from '../../mapping/icon';
import {
    TableColumnIconValidator
} from './models/table-column-icon-validator';
import type { ColumnInternalsOptions } from '../base/models/column-internals';
import { tableColumnIconGroupHeaderViewTag } from './group-header-view';
import { tableColumnIconCellViewTag } from './cell-view';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-table-column-icon': TableColumnIcon;
    }
}

/**
 * Table column that maps values to icons / spinners
 */
export class TableColumnIcon extends mixinGroupableColumnAPI(
    mixinFixedWidthColumnAPI(TableColumnEnumBase<TableColumnEnumColumnConfig>)
) {
    protected get supportedMappingElements(): readonly (typeof Mapping)[] {
        return [MappingIcon, MappingSpinner] as const;
    }

    private readonly validator: TableColumnIconValidator = new TableColumnIconValidator(
        this.columnInternals
    );

    public override get validity(): TableColumnValidity {
        return this.validator.getValidity();
    }

    protected override getColumnInternalsOptions(): ColumnInternalsOptions {
        return {
            cellRecordFieldNames: ['value'],
            cellViewTag: tableColumnIconCellViewTag,
            groupHeaderViewTag: tableColumnIconGroupHeaderViewTag,
            delegatedEvents: [],
            sortOperation: TableColumnSortOperation.basic
        };
    }

    protected override updateColumnConfig(): void {
        // validate the mappings
        // if valid, create the columnConfig

        // this.columnInternals.columnConfig = {
        //     mappingConfigs: this.getMappingConfigsFromMappings()
        // };
    }
}

const nimbleTableColumnIcon = TableColumnIcon.compose({
    baseName: 'table-column-icon',
    template,
    styles
});

DesignSystem.getOrCreate()
    .withPrefix('nimble')
    .register(nimbleTableColumnIcon());
export const tableColumnIconTag = DesignSystem.tagFor(TableColumnIcon);
