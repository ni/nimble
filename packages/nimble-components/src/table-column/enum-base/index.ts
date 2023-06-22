import {
    attr,
    Notifier,
    Observable,
    observable,
    Subscriber
} from '@microsoft/fast-element';
import type { TableAnyField } from '../../table/types';
import { TableColumn } from '../base';
import { Mapping } from '../../mapping/base';
import type { MappingConfig, MappingKeyType } from '../../mapping/base/types';

export type TableColumnEnumCellRecord = TableAnyField<'value'>;

export interface TableColumnEnumColumnConfig {
    mappingConfigs: MappingConfig[];
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

    protected abstract get supportedMappingTypes(): readonly (typeof Mapping)[];

    private mappingNotifiers: Notifier[] = [];

    /**
     * @internal
     *
     * The event handler that is called when a notifier detects a change. Notifiers are added
     * to each mapping, so `source` is expected to be an instance of `Mapping`, and `args`
     * is the string name of the property that changed on that column.
     */
    public handleChange(source: unknown, args: unknown): void {
        if (source instanceof Mapping && typeof args === 'string') {
            this.updateColumnConfig();
        }
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

    protected abstract updateColumnConfig(): void;

    protected getMappingConfigsFromMappings(): MappingConfig[] {
        return this.mappings.map(mapping => mapping.getMappingConfig(this.keyType));
    }

    private removeMappingObservers(): void {
        if (this.mappingNotifiers) {
            this.mappingNotifiers.forEach(notifier => {
                notifier.unsubscribe(this);
            });
            this.mappingNotifiers = [];
        }
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
}
