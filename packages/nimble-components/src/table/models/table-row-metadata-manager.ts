import type { TableNode, TableRecord, TableRowMetadata } from '../types';
import { convertRecordsToUnorderFlatList } from './hierarchy-utilities';

function isString(value: string | undefined): value is string {
    return typeof value === 'string';
}

/**
 * Class that maintains the metadata associated with each row in the table.
 */
export class TableRowMetadataManager<TData extends TableRecord> {
    private idFieldName: string | undefined;
    private metadata = new Map<string, TableRowMetadata>();

    public handleDataUpdate(orderedData: readonly TData[]): void {
        if (!isString(this.idFieldName)) {
            return;
        }

        const updatedMetadata = new Map<string, TableRowMetadata>();
        for (let i = 0; i < orderedData.length; i++) {
            const recordId = this.getRecordId(orderedData[i]!, this.idFieldName);
            const existingMetadataForRecord = this.metadata.get(recordId);

            let updatedMetadataForRecord: TableRowMetadata;
            if (existingMetadataForRecord) {
                updatedMetadataForRecord = {
                    ...existingMetadataForRecord,
                    originalIndex: i
                };
            } else {
                updatedMetadataForRecord = {
                    originalIndex: i
                };
            }
            updatedMetadata.set(recordId, updatedMetadataForRecord);
        }
        this.metadata = updatedMetadata;
    }

    public handleRowIdUpdate(data: readonly TableNode<TData>[], newIdFieldName: string | undefined): void {
        const previousIdFieldName = this.idFieldName;
        this.idFieldName = newIdFieldName;

        if (!isString(newIdFieldName)) {
            this.metadata.clear();
            return;
        }

        // mkreis TODO: but this is unordered?? What's supposed to handle the case that id becomes defined and the order needs to be cached?
        const flatData = convertRecordsToUnorderFlatList(data);

        if (!isString(previousIdFieldName) || this.metadata.size === 0) {
            this.handleDataUpdate(flatData);
            return;
        }

        const updatedMetadata = new Map<string, TableRowMetadata>();
        for (const record of flatData) {
            const previousRecordId = this.getRecordId(record, previousIdFieldName);
            const newRecordId = this.getRecordId(record, newIdFieldName);
            const recordMetadata = this.metadata.get(previousRecordId)!;
            updatedMetadata.set(newRecordId, recordMetadata);
        }
        this.metadata = updatedMetadata;
    }

    public getOrderedData(data: readonly TableNode<TData>[]): TData[] {
        const flatData = convertRecordsToUnorderFlatList(data);

        // TODO: this used to check for isDataOrdered
        if (!isString(this.idFieldName)) {
            return flatData;
        }

        flatData.sort((a, b) => {
            const leftRecordIndex = this.metadata.get(
                this.getRecordId(a, this.idFieldName!)
            )!.originalIndex;
            const rightRecordIndex = this.metadata.get(
                this.getRecordId(b, this.idFieldName!)
            )!.originalIndex;

            if (leftRecordIndex < rightRecordIndex) {
                return -1;
            }

            if (leftRecordIndex > rightRecordIndex) {
                return 1;
            }

            return 0;
        });

        return flatData;
    }

    private getRecordId(record: TData, idFieldName: string): string {
        const id = record[idFieldName];
        if (typeof id !== 'string') {
            throw new Error('Invalid record id found. Data should be valid before updating the metadata.');
        }
        return id;
    }
}