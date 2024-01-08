import {
    attr,
    Notifier,
    Observable,
    observable,
    Subscriber
} from '@microsoft/fast-element';
import type {
    TableStringField,
    TableBooleanField,
    TableNumberField
} from '../../table/types';
import { TableColumn } from '../base';
import { Mapping } from '../../mapping/base';
import type { MappingKeyType } from './types';
import type { MappingConfig } from './models/mapping-config';
import type { MappingKey } from '../../mapping/base/types';
import { resolveKeyWithType } from './models/mapping-key-resolver';
import { TableColumnEnumBaseValidator } from './models/table-column-enum-base-validator';

export type TableColumnEnumCellRecord =
    | TableStringField<'value'>
    | TableBooleanField<'value'>
    | TableNumberField<'value'>;
export type MappingConfigs = Map<MappingKey, MappingConfig>;
export interface TableColumnEnumColumnConfig {
    mappingConfigs: MappingConfigs;
}

/**
 * Base class for table columns that map values to content (e.g. nimble-table-column-enum-text and nimble-table-column-icon)
 */
export abstract class TableColumnEnumBase<
    TColumnConfig extends TableColumnEnumColumnConfig
>
    extends TableColumn<TColumnConfig>
    implements Subscriber {
    /** @internal */
    public mappingNotifiers: Notifier[] = [];

    /** @internal */
    @observable
    public mappings: Mapping<unknown>[] = [];

    @attr({ attribute: 'field-name' })
    public fieldName?: string;

    @attr({ attribute: 'key-type' })
    public keyType: MappingKeyType = 'string';

    /**
     * @internal
     *
     * Triggers a request to update the columnConfig when any observable property on
     * a mapping is updated.
     */
    public handleChange(source: unknown, args: unknown): void {
        if (source instanceof Mapping && typeof args === 'string') {
            this.updateColumnConfig();
        }
    }

    /**
     * Implementations should throw an error if an invalid Mapping is passed.
     */
    protected abstract createMappingConfig(
        mapping: Mapping<unknown>
    ): MappingConfig;

    protected abstract createColumnConfig(
        mappingConfigs: MappingConfigs
    ): TColumnConfig;

    /**
     * Called when any Mapping related state has changed.
     */
    private updateColumnConfig(): void {
        const validator = this.getTypedValidator(TableColumnEnumBaseValidator<[]>);
        validator.validate(this.mappings, this.keyType);
        this.columnInternals.columnConfig = validator.isValid()
            ? this.createColumnConfig(this.getMappingConfigs())
            : undefined;
    }

    private getMappingConfigs(): MappingConfigs {
        const mappingConfigs = new Map<MappingKey, MappingConfig>();
        this.mappings.forEach(mapping => {
            const key = resolveKeyWithType(mapping.key, this.keyType);
            if (key === undefined) {
                throw Error(
                    'Key was invalid for type. Validation should have prevented this.'
                );
            }
            const mappingConfig = this.createMappingConfig(mapping);
            mappingConfigs.set(key, mappingConfig);
        });
        return mappingConfigs;
    }

    private fieldNameChanged(): void {
        this.columnInternals.dataRecordFieldNames = [this.fieldName];
        this.columnInternals.operandDataRecordFieldName = this.fieldName;
    }

    private mappingsChanged(): void {
        this.updateColumnConfig();
        this.observeMappings();
    }

    private keyTypeChanged(): void {
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

        for (const mapping of this.mappings) {
            const notifier = Observable.getNotifier(mapping);
            notifier.subscribe(this);
            this.mappingNotifiers.push(notifier);
        }
    }
}
