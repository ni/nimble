/* eslint-disable max-classes-per-file */
import { DesignSystem } from '@microsoft/fast-foundation';
import { styles } from '../mapping-base/styles';
import { template } from '../mapping-base/template';
import type { TableAnyField } from '../../table/types';
import type { TableColumnValidity } from '../base/types';
import { Mapping } from '../../mapping/base';
import { mixinGroupableColumnAPI } from '../mixins/groupable-column';
import { mixinFixedWidthColumnAPI } from '../mixins/fixed-width-column';
import { MappingSpinner } from '../../mapping/spinner';
import { MappingIcon } from '../../mapping/icon';
import {
    iconColumnValidityFlagNames,
    TableColumnIconValidator
} from './models/column-validator';
import { TableColumnMappingBase } from '../mapping-base';

export type TableColumnMappingCellRecord = TableAnyField<'value'>;
export interface TableColumnMappingColumnConfig {
    typedKeysToMappings: (
        | readonly [number | null, Mapping]
        | readonly [boolean | null, Mapping]
        | readonly [string | null, Mapping]
    )[];
}

declare global {
    interface HTMLElementTagNameMap {
        'nimble-table-column-icon': TableColumnIcon;
    }
}

/**
 * Table column that maps values to icons/spinners
 */
export class TableColumnIcon extends mixinGroupableColumnAPI(
    mixinFixedWidthColumnAPI(TableColumnMappingBase)
) {
    protected supportedMappingTypes: (typeof Mapping)[] = [
        MappingIcon,
        MappingSpinner
    ];

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
                const keys = this.mappings?.map(x => x.key) ?? [];
                this.validator.validateKeyValuesForType(keys, this.keyType);
                const typedKeys = this.columnInternals.columnConfig?.typedKeysToMappings.map(
                    x => x[0]
                ) ?? [];
                this.validator.validateUniqueKeys(typedKeys);
                this.validator.validateNoMissingKeys(this.mappings ?? []);
            } else if (args === 'icon') {
                this.validator.validateIconNames(this.mappings ?? []);
            }
        }
    }

    protected override mappingsChanged(): void {
        super.mappingsChanged();
        const keys = this.mappings?.map(x => x.key) ?? [];
        this.validator.validateKeyValuesForType(keys, this.keyType);
        this.validator.validateAtMostOneDefaultMapping(this.mappings ?? []);
        this.validator.validateMappingTypes(
            this.mappings ?? [],
            this.supportedMappingTypes
        );
        const typedKeys = this.columnInternals.columnConfig?.typedKeysToMappings.map(
            x => x[0]
        ) ?? [];
        this.validator.validateUniqueKeys(typedKeys);
        this.validator.validateNoMissingKeys(this.mappings ?? []);
        this.validator.validateIconNames(this.mappings ?? []);
    }

    protected override keyTypeChanged(): void {
        super.keyTypeChanged();
        this.validator?.validateKeyValuesForType(
            this.mappings?.map(x => x.key) ?? [],
            this.keyType
        );
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
