import {
    attr,
    Notifier,
    Observable,
    observable,
    Subscriber
} from '@microsoft/fast-element';
import type { TableStringField, TableBooleanField, TableNumberField } from '../../table/types';
import { TableColumn } from '../base';
import { Mapping } from '../../mapping/base';
import type { MappingKeyType } from './types';
import type { MappingConfig } from './models/mapping-config';
import type { MappingKey } from '../../mapping/base/types';

export type TableColumnEnumCellRecord = TableStringField<'value'> | TableBooleanField<'value'> | TableNumberField<'value'>;

export interface TableColumnEnumColumnConfig {
    mappingConfigs: Map<MappingKey, MappingConfig>;
    default: MappingConfig;
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
    @observable
    public mappings: Mapping[] = [];

    @attr({ attribute: 'field-name' })
    public fieldName?: string;

    @attr({ attribute: 'key-type' })
    public keyType: MappingKeyType = 'string';

    protected abstract get supportedMappingElements(): readonly (typeof Mapping)[];

    private mappingNotifiers: Notifier[] = [];

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

    // TODO should we batch this on rAF?
    /**
    * Called when any Mapping related state has changed
    */
    protected abstract updateColumnConfig(): void;

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
