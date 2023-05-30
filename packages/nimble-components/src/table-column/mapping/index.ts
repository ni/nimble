/* eslint-disable max-classes-per-file */
import { DesignSystem } from '@microsoft/fast-foundation';
import {
    attr,
    booleanConverter,
    Notifier,
    nullableNumberConverter,
    Observable,
    observable,
    Subscriber
} from '@microsoft/fast-element';
import { styles } from './styles';
import { template } from './template';
import type { TableAnyField } from '../../table/types';
import { TableColumn } from '../base';
import { TableColumnSortOperation, TableColumnValidity } from '../base/types';
import { tableColumnMappingCellViewTag } from './cell-view';
import { Mapping } from './mappings';
import { tableColumnMappingGroupHeaderViewTag } from './group-header-view';
import { mixinGroupableColumnAPI } from '../mixins/groupable-column';
import { mixinFractionalWidthColumnAPI } from '../mixins/fractional-width-column';
import { mixinFixedWidthColumnAPI } from '../mixins/fixed-width-column';
import { MappingText } from './mappings/text';
import { MappingSpinner } from './mappings/spinner';
import { MappingIcon } from './mappings/icon';
import type { ColumnInternalsOptions } from '../base/models/column-internals';
import {
    iconColumnValidityFlagNames,
    mappingColumnValidityFlagNames,
    TableColumnIconValidator,
    TableColumnMappingValidator
} from './models/column-validator';

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
        'nimble-table-column-mapping': TableColumnMapping;
        'nimble-table-column-icon': TableColumnIcon;
    }
}

/**
 * Base class for table columns that map values to content
 */
export abstract class TableColumnMappingBase
    extends TableColumn<TableColumnMappingColumnConfig>
    implements Subscriber {
    @attr({ attribute: 'field-name' })
    public fieldName?: string;

    @attr({ attribute: 'key-type' })
    public keyType: 'string' | 'number' | 'boolean' = 'string';

    /** @internal */
    @observable
    public mappings?: Mapping[];

    protected abstract supportedMappingTypes: (typeof Mapping)[];

    private mappingNotifiers: Notifier[] = [];

    public constructor() {
        super();
        this.columnInternals.sortOperation = TableColumnSortOperation.basic;
    }

    /**
     * @internal
     *
     * The event handler that is called when a notifier detects a change. Notifiers are added
     * to each mapping, so `source` is expected to be an instance of `Mapping`, and `args`
     * is the string name of the property that changed on that column.
     */
    public handleChange(source: unknown, args: unknown): void {
        if (source instanceof Mapping && typeof args === 'string') {
            if (args === 'key') {
                this.updateColumnConfig();
            }
        }
    }

    protected getColumnInternalsOptions(): ColumnInternalsOptions {
        return {
            cellRecordFieldNames: ['value'],
            cellViewTag: tableColumnMappingCellViewTag,
            groupHeaderViewTag: tableColumnMappingGroupHeaderViewTag,
            delegatedEvents: []
        };
    }

    protected fieldNameChanged(): void {
        this.columnInternals.dataRecordFieldNames = [this.fieldName];
        this.columnInternals.operandDataRecordFieldName = this.fieldName;
    }

    protected mappingsChanged(): void {
        this.updateColumnConfig();
        this.observeMappings();
    }

    protected keyTypeChanged(): void {
        this.updateColumnConfig();
    }

    private removeMappingObservers(): void {
        this.mappingNotifiers.forEach(notifier => {
            notifier.unsubscribe(this);
        });
        this.mappingNotifiers = [];
    }

    private observeMappings(): void {
        this.removeMappingObservers();
        if (!this.mappings) {
            return;
        }

        for (const mapping of this.mappings) {
            const notifier = Observable.getNotifier(mapping);
            notifier.subscribe(this);
            this.mappingNotifiers.push(notifier);
        }
    }

    private updateColumnConfig(): void {
        let typedKeysToMappings;
        if (this.keyType === 'number') {
            typedKeysToMappings = this.getMappingsFromNumberKeys();
        } else if (this.keyType === 'boolean') {
            typedKeysToMappings = this.getMappingsFromBooleanKeys();
        } else {
            typedKeysToMappings = this.getMappingsFromStringKeys();
        }
        this.columnInternals.columnConfig = {
            typedKeysToMappings
        };
    }

    private getMappingsFromNumberKeys(): (readonly [number | null, Mapping])[] {
        const typedKeysToMappings = [];
        if (this.mappings) {
            for (const mapping of this.mappings) {
                const convertedKey = nullableNumberConverter.fromView(
                    mapping.key
                ) as number;
                typedKeysToMappings.push([convertedKey, mapping] as const);
            }
        }
        return typedKeysToMappings;
    }

    private getMappingsFromBooleanKeys(): (readonly [
        boolean | null,
        Mapping
    ])[] {
        const typedKeysToMappings = [];
        if (this.mappings) {
            for (const mapping of this.mappings) {
                const convertedKey = mapping.key === undefined
                    ? null
                    : (booleanConverter.fromView(mapping.key) as boolean);
                typedKeysToMappings.push([convertedKey, mapping] as const);
            }
        }
        return typedKeysToMappings;
    }

    private getMappingsFromStringKeys(): (readonly [string | null, Mapping])[] {
        const typedKeysToMappings = [];
        if (this.mappings) {
            for (const mapping of this.mappings) {
                const convertedKey = mapping.key === undefined ? null : mapping.key.toString();
                typedKeysToMappings.push([convertedKey, mapping] as const);
            }
        }
        return typedKeysToMappings;
    }
}

/**
 * Table column that maps values to strings
 */
export class TableColumnMapping extends mixinGroupableColumnAPI(
    mixinFractionalWidthColumnAPI(TableColumnMappingBase)
) {
    protected supportedMappingTypes: (typeof Mapping)[] = [MappingText];

    private readonly validator: TableColumnMappingValidator = new TableColumnMappingValidator(
        this.columnInternals,
        mappingColumnValidityFlagNames
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
    }

    protected override keyTypeChanged(): void {
        super.keyTypeChanged();
        this.validator?.validateKeyValuesForType(
            this.mappings?.map(x => x.key) ?? [],
            this.keyType
        );
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
export const tableColumnMappingTag = DesignSystem.tagFor(TableColumnMapping);

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
