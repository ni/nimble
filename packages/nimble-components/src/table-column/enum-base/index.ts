import {
    attr,
    booleanConverter,
    Notifier,
    nullableNumberConverter,
    Observable,
    observable,
    Subscriber,
    ViewTemplate
} from '@microsoft/fast-element';
import type { TableAnyField } from '../../table/types';
import { TableColumn } from '../base';
import { TableColumnSortOperation } from '../base/types';
import { tableColumnEnumCellViewTag } from './cell-view';
import { Mapping } from '../../mapping/base';
import { tableColumnEnumGroupHeaderViewTag } from './group-header-view';
import type { ColumnInternalsOptions } from '../base/models/column-internals';

export type TableColumnEnumCellRecord = TableAnyField<'value'>;

export interface ConvertedKeyMapping {
    key: string | number | boolean | null;
    defaultMapping: boolean;
    cellViewTemplate: ViewTemplate;
    groupHeaderViewTemplate: ViewTemplate;
}
export interface TableColumnEnumColumnConfig {
    convertedKeyMappings: ConvertedKeyMapping[];
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
    public mappings: Mapping[] = [];

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
        const convertedKeyMappings: ConvertedKeyMapping[] = [];
        for (const mapping of this.mappings) {
            convertedKeyMappings.push({
                key: this.typeConvertKey(mapping.key),
                defaultMapping: mapping.defaultMapping,
                cellViewTemplate: mapping.cellViewTemplate,
                groupHeaderViewTemplate: mapping.groupHeaderViewTemplate
            });
        }

        this.columnInternals.columnConfig = {
            convertedKeyMappings
        };
    }

    private typeConvertKey(key: string | boolean | number | undefined): string | boolean | number | null {
        if (this.keyType === 'number') {
            return nullableNumberConverter.fromView(
                key
            ) as number;
        }
        if (this.keyType === 'boolean') {
            return key === undefined
                ? null
                : (booleanConverter.fromView(key) as boolean);
        }
        return key === undefined ? null : key.toString();
    }
}
