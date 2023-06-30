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

export type TableColumnEnumCellRecord =
    | TableStringField<'value'>
    | TableBooleanField<'value'>
    | TableNumberField<'value'>;
export type MappingConfigs = Map<MappingKey, MappingConfig>;
export interface TableColumnEnumColumnConfig {
    mappingConfigs: MappingConfigs;
    defaultMapping?: MappingConfig;
}

/**
 * Base class for table columns that map values to content (e.g. nimble-table-column-enum-text and nimble-table-column-icon)
 */
export abstract class TableColumnEnumBase<
    TColumnConfig extends TableColumnEnumColumnConfig,
    TEnumValidator
>
    extends TableColumn<TColumnConfig>
    implements Subscriber {
    /** @internal */
    public validator = this.createValidator();

    /** @internal */
    public mappingNotifiers: Notifier[] = [];

    /** @internal */
    @observable
    public mappings: Mapping[] = [];

    @attr({ attribute: 'field-name' })
    public fieldName?: string;

    @attr({ attribute: 'key-type' })
    public keyType: MappingKeyType = 'string';

    protected abstract get supportedMappingElements(): readonly (typeof Mapping)[];

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

    public abstract createValidator(): TEnumValidator;

    // TODO should we batch updateColumnConfig this on rAF?
    /**
     * Called when any Mapping related state has changed
     */
    protected abstract updateColumnConfig(): void;

    // Assumes the mapping element state is validated
    protected abstract createMappingConfig(mapping: Mapping): MappingConfig;

    // Assumes the mapping element state is validated
    protected createColumnConfig(): TableColumnEnumColumnConfig {
        const mappingConfigs = new Map<MappingKey, MappingConfig>();
        let defaultMapping: Mapping | undefined;
        this.mappings.forEach(mapping => {
            const key = resolveKeyWithType(mapping.key, this.keyType);
            if (key !== undefined) {
                const mappingConfig = this.createMappingConfig(mapping);
                mappingConfigs.set(key, mappingConfig);
            }
            // defaultMapping can be from either undefined or defined key
            if (mapping.defaultMapping) {
                defaultMapping = mapping;
            }
        });
        return {
            mappingConfigs,
            defaultMapping
        };
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
