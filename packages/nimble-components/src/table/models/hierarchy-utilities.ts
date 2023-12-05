import type { TableNode, TableRecord } from '../types';

export function convertRecordToFlatList<TData extends TableRecord>(
    record: TableNode<TData>,
    flatData: TData[]
): void {
    flatData.push(record.clientRecord);
    record.subRows?.forEach(subRow => {
        convertRecordToFlatList(subRow, flatData);
    });
}

export function convertRecordsToUnorderFlatList<TData extends TableRecord>(data: readonly TableNode<TData>[]): TData[] {
    const flatData: TData[] = [];
    data.forEach(record => {
        convertRecordToFlatList<TData>(record, flatData);
    });
    return flatData;
}