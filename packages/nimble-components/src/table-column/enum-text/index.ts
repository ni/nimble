import { DesignSystem } from '@microsoft/fast-foundation';
import { attr } from '@microsoft/fast-element';
import { TableColumnEnumBase, TableColumnEnumColumnConfig } from '../enum-base';
import { styles } from '../enum-base/styles';
import { template } from '../enum-base/template';
import { TableColumnSortOperation, TableColumnValidity } from '../base/types';
import { mixinGroupableColumnAPI } from '../mixins/groupable-column';
import { mixinFractionalWidthColumnAPI } from '../mixins/fractional-width-column';
import { Mapping } from '../../mapping/base';
import { MappingText } from '../../mapping/text';
import {
    enumTextColumnValidityFlagNames,
    TableColumnEnumTextValidator
} from './models/column-validator';
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
        this.columnInternals,
        enumTextColumnValidityFlagNames
    );

    public override get validity(): TableColumnValidity {
        return this.validator.getValidity();
    }

    public override connectedCallback(): void {
        this.validator.validateAtMostOneDefaultMapping(this.mappings);
        this.validator.validateMappingTypes(
            this.mappings,
            this.supportedMappingTypes
        );
        this.validateKeyDependentConditions();
    }

    /**
     * @internal
     */
    public override handleChange(source: unknown, args: unknown): void {
        super.handleChange(source, args);
        if (source instanceof Mapping && typeof args === 'string') {
            if (args === 'key' && this.$fastController.isConnected) {
                this.validateKeyDependentConditions();
            }
        }
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

    protected override mappingsChanged(): void {
        super.mappingsChanged();
        if (this.$fastController.isConnected) {
            this.validator.validateAtMostOneDefaultMapping(this.mappings);
            this.validator.validateMappingTypes(
                this.mappings,
                this.supportedMappingTypes
            );
            this.validateKeyDependentConditions();
        }
    }

    protected override keyTypeChanged(): void {
        super.keyTypeChanged();
        if (this.$fastController.isConnected) {
            this.validator.validateKeyValuesForType(
                this.mappings.map(x => x.key),
                this.keyType
            );
        }
    }

    protected override updateColumnConfig(): void {
        this.columnInternals.columnConfig = {
            mappingConfigs: this.getMappingConfigsFromMappings(),
            placeholder: this.placeholder ?? ''
        };
    }

    private placeholderChanged(): void {
        this.updateColumnConfig();
    }

    private validateKeyDependentConditions(): void {
        const keys = this.mappings.map(x => x.key);
        this.validator.validateKeyValuesForType(keys, this.keyType);
        const typedKeys = this.columnInternals.columnConfig?.mappingConfigs.map(x => x.key)
            ?? [];
        this.validator.validateUniqueKeys(typedKeys);
        this.validator.validateNoMissingKeys(this.mappings);
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
