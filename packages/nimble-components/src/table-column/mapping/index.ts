import { DesignSystem } from '@microsoft/fast-foundation';
import { attr } from '@microsoft/fast-element';
import {
    MappingConfigs,
    TableColumnEnumBase,
    TableColumnEnumColumnConfig
} from '../enum-base';
import { styles } from '../enum-base/styles';
import { template } from '../enum-base/template';
import {
    TableColumnSortOperation,
    singleIconColumnWidth,
    defaultMinPixelWidth
} from '../base/types';
import { mixinGroupableColumnAPI } from '../mixins/groupable-column';
import { mixinFractionalWidthColumnAPI } from '../mixins/fractional-width-column';
import { MappingSpinner } from '../../mapping/spinner';
import { MappingIcon } from '../../mapping/icon';
import { TableColumnMappingValidator } from './models/table-column-mapping-validator';
import type { ColumnInternalsOptions } from '../base/models/column-internals';
import { tableColumnMappingGroupHeaderViewTag } from './group-header-view';
import { tableColumnMappingCellViewTag } from './cell-view';
import type { Mapping } from '../../mapping/base';
import type { MappingConfig } from '../enum-base/models/mapping-config';
import { MappingIconConfig } from '../enum-base/models/mapping-icon-config';
import { MappingSpinnerConfig } from '../enum-base/models/mapping-spinner-config';
import { MappingText } from '../../mapping/text';
import { MappingTextConfig } from '../enum-base/models/mapping-text-config';
import { MappingEmpty } from '../../mapping/empty';
import { MappingEmptyConfig } from '../enum-base/models/mapping-empty-config';
import { TableColumnMappingWidthMode } from './types';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-table-column-mapping': TableColumnMapping;
    }
}

/**
 * Table column that maps number, boolean, or string values to an icon, a spinner,
 * text, or an icon/spinner with text.
 */
export class TableColumnMapping extends mixinGroupableColumnAPI(
    mixinFractionalWidthColumnAPI(
        TableColumnEnumBase<
        TableColumnEnumColumnConfig,
        TableColumnMappingValidator
        >
    )
) {
    @attr({ attribute: 'width-mode' })
    public widthMode: TableColumnMappingWidthMode;

    public override minPixelWidthChanged(): void {
        if (this.widthMode !== TableColumnMappingWidthMode.iconSize) {
            this.columnInternals.minPixelWidth = this.getConfiguredMinPixelWidth();
        }
    }

    protected override getColumnInternalsOptions(): ColumnInternalsOptions<TableColumnMappingValidator> {
        return {
            cellRecordFieldNames: ['value'],
            cellViewTag: tableColumnMappingCellViewTag,
            groupHeaderViewTag: tableColumnMappingGroupHeaderViewTag,
            delegatedEvents: [],
            sortOperation: TableColumnSortOperation.basic,
            validator: new TableColumnMappingValidator()
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
            if (!mapping.resolvedIcon) {
                throw Error('Unresolved icon');
            }

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
        if (mapping instanceof MappingEmpty) {
            return new MappingEmptyConfig(mapping.text);
        }
        // Getting here would indicate a programming error, b/c validation will prevent
        // this function from running when there is an unsupported mapping.
        throw new Error('Unsupported mapping');
    }

    private widthModeChanged(): void {
        if (this.widthMode === TableColumnMappingWidthMode.iconSize) {
            this.columnInternals.resizingDisabled = true;
            this.columnInternals.hideHeaderIndicators = true;
            this.columnInternals.pixelWidth = singleIconColumnWidth;
            this.columnInternals.minPixelWidth = singleIconColumnWidth;
        } else {
            this.columnInternals.resizingDisabled = false;
            this.columnInternals.hideHeaderIndicators = false;
            this.columnInternals.pixelWidth = undefined;
            this.columnInternals.minPixelWidth = this.getConfiguredMinPixelWidth();
        }
    }

    private getConfiguredMinPixelWidth(): number {
        if (typeof this.minPixelWidth === 'number') {
            return this.minPixelWidth;
        }
        return defaultMinPixelWidth;
    }
}

const nimbleTableColumnMapping = TableColumnMapping.compose({
    baseName: 'table-column-mapping',
    template,
    styles
});

DesignSystem.getOrCreate()
    .withPrefix('nimble')
    .register(nimbleTableColumnMapping());
export const tableColumnMappingTag = 'nimble-table-column-mapping';
