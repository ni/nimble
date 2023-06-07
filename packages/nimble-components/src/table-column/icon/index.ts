/* eslint-disable max-classes-per-file */
import { DesignSystem } from '@microsoft/fast-foundation';
import { TableColumnEnumBase } from '../enum-base';
import { styles } from '../enum-base/styles';
import { template } from '../enum-base/template';
import { TableColumnSortOperation, TableColumnValidity } from '../base/types';
import { mixinGroupableColumnAPI } from '../mixins/groupable-column';
import { mixinFixedWidthColumnAPI } from '../mixins/fixed-width-column';
import { Mapping } from '../../mapping/base';
import { MappingSpinner } from '../../mapping/spinner';
import { MappingIcon } from '../../mapping/icon';
import {
    iconColumnValidityFlagNames,
    TableColumnIconValidator
} from './models/column-validator';
import type { ColumnInternalsOptions } from '../base/models/column-internals';
import { tableColumnIconGroupHeaderViewTag } from './group-header-view';
import { tableColumnIconCellViewTag } from './cell-view';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-table-column-icon': TableColumnIcon;
    }
}

/**
 * Table column that maps values to icons/spinners
 */
export class TableColumnIcon extends mixinGroupableColumnAPI(
    mixinFixedWidthColumnAPI(TableColumnEnumBase)
) {
    protected get supportedMappingTypes(): readonly (typeof Mapping)[] {
        return [MappingIcon, MappingSpinner] as const;
    }

    private readonly validator: TableColumnIconValidator = new TableColumnIconValidator(
        this.columnInternals,
        iconColumnValidityFlagNames
    );

    public override get validity(): TableColumnValidity {
        return this.validator.getValidity();
    }

    /**
     * @internal
     */
    public override handleChange(source: unknown, args: unknown): void {
        super.handleChange(source, args);
        if (source instanceof Mapping && typeof args === 'string') {
            if (args === 'key') {
                this.validateKeyDependentConditions();
            } else if (args === 'icon') {
                this.validator.validateIconNames(this.mappings);
            }
        }
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

    protected override mappingsChanged(): void {
        super.mappingsChanged();
        this.validator?.validateAtMostOneDefaultMapping(this.mappings);
        this.validator?.validateMappingTypes(
            this.mappings,
            this.supportedMappingTypes
        );
        this.validateKeyDependentConditions();
        this.validator?.validateIconNames(this.mappings);
    }

    protected override keyTypeChanged(): void {
        super.keyTypeChanged();
        this.validator?.validateKeyValuesForType(
            this.mappings.map(x => x.key),
            this.keyType
        );
    }

    private validateKeyDependentConditions(): void {
        const keys = this.mappings.map(x => x.key);
        this.validator?.validateKeyValuesForType(keys, this.keyType);
        const typedKeys = this.columnInternals.columnConfig?.mappingConfigs.map(x => x.key)
            ?? [];
        this.validator?.validateUniqueKeys(typedKeys);
        this.validator?.validateNoMissingKeys(this.mappings);
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
