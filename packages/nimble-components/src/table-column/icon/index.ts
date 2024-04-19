import { DesignSystem } from '@microsoft/fast-foundation';
import {
    MappingConfigs,
    TableColumnEnumBase,
    TableColumnEnumColumnConfig
} from '../enum-base';
import { styles } from '../enum-base/styles';
import { template } from '../enum-base/template';
import {
    TableColumnSortOperation,
    columnIconSize,
    columnSpacing
} from '../base/types';
import { mixinGroupableColumnAPI } from '../mixins/groupable-column';
import { MappingSpinner } from '../../mapping/spinner';
import { MappingIcon } from '../../mapping/icon';
import { TableColumnIconValidator } from './models/table-column-icon-validator';
import type { ColumnInternalsOptions } from '../base/models/column-internals';
import { tableColumnIconGroupHeaderViewTag } from './group-header-view';
import { tableColumnIconCellViewTag } from './cell-view';
import type { Mapping } from '../../mapping/base';
import type { MappingConfig } from '../enum-base/models/mapping-config';
import { MappingIconConfig } from '../enum-base/models/mapping-icon-config';
import { MappingSpinnerConfig } from '../enum-base/models/mapping-spinner-config';
import { MappingText } from '../../mapping/text';
import { MappingTextConfig } from '../enum-base/models/mapping-text-config';

const fixedColumnSize = columnIconSize + 2 * columnSpacing;

declare global {
    interface HTMLElementTagNameMap {
        'nimble-table-column-icon': TableColumnIcon;
    }
}

/**
 * Table column that maps values to icons / spinners
 */
export class TableColumnIcon extends mixinGroupableColumnAPI(
    TableColumnEnumBase<TableColumnEnumColumnConfig, TableColumnIconValidator>
) {
    protected override getColumnInternalsOptions(): ColumnInternalsOptions<TableColumnIconValidator> {
        return {
            cellRecordFieldNames: ['value'],
            cellViewTag: tableColumnIconCellViewTag,
            groupHeaderViewTag: tableColumnIconGroupHeaderViewTag,
            delegatedEvents: [],
            sortOperation: TableColumnSortOperation.basic,
            validator: new TableColumnIconValidator()
        };
    }

    protected override createColumnConfig(
        mappingConfigs: MappingConfigs
    ): TableColumnEnumColumnConfig {
        return {
            mappingConfigs
        };
    }

    protected createMappingConfig(mapping: Mapping<unknown>): MappingConfig {
        if (mapping instanceof MappingIcon) {
            return new MappingIconConfig(
                mapping.resolvedIcon,
                mapping.severity,
                mapping.text,
                mapping.textHidden
            );
        }
        if (mapping instanceof MappingSpinner) {
            return new MappingSpinnerConfig(mapping.text, mapping.textHidden);
        }
        if (mapping instanceof MappingText) {
            return new MappingTextConfig(mapping.text);
        }
        // Getting here would indicate a programming error, b/c validation will prevent
        // this function from running when there is an unsupported mapping.
        throw new Error('Unsupported mapping');
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
export const tableColumnIconTag = 'nimble-table-column-icon';
