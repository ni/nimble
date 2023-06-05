import {
    attr,
    booleanConverter,
    Notifier,
    nullableNumberConverter,
    Observable,
    observable,
    Subscriber
} from '@microsoft/fast-element';
import type { TableAnyField } from '../../table/types';
import { TableColumn } from '../base';
import { TableColumnSortOperation } from '../base/types';
import { tableColumnEnumCellViewTag } from './cell-view';
import { Mapping } from '../../mapping/base';
import { tableColumnEnumGroupHeaderViewTag } from './group-header-view';
import type { ColumnInternalsOptions } from '../base/models/column-internals';

export type TableColumnEnumCellRecord = TableAnyField<'value'>;
export interface TableColumnEnumColumnConfig {
    typedKeysToMappings: (
        | readonly [number | null, Mapping]
        | readonly [boolean | null, Mapping]
        | readonly [string | null, Mapping]
    )[];
}

/**
 * Base class for table columns that map values to content (e.g. nimble-table-column-enum-text and nimble-table-column-icon)
 */
export abstract class TableColumnEnumBase
    extends TableColumn<TableColumnEnumColumnConfig>
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
            cellViewTag: tableColumnEnumCellViewTag,
            groupHeaderViewTag: tableColumnEnumGroupHeaderViewTag,
            delegatedEvents: [],
            sortOperation: TableColumnSortOperation.basic
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
