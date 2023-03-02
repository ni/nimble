import {
    SortingFnOption as TanStackSortingFnOption,
    sortingFns as TanStackSortingFns,
    Row as TanStackRow
} from '@tanstack/table-core';
import { TableColumnSortOperation } from '../../table-column/base/types';

/**
 * Returns the sorting function for TanStack to use based on the specified
 * TableColumnSortOperation
 */
export function getTanStackSortingFunction<TData>(
    sortOperation: TableColumnSortOperation
): TanStackSortingFnOption<TData> {
    switch (sortOperation) {
        case TableColumnSortOperation.basic:
            return TanStackSortingFns.basic;
        case TableColumnSortOperation.localeAwareCaseSensitive:
            return localeAwareCaseSensitiveSortFunction;
        default:
            return TanStackSortingFns.basic;
    }
}

/**
 * A function to perform locale-aware and case-senstitive sorting of two rows from
 * TanStack for a given column. The function sorts `undefined` followed by `null`
 * before all defined strings.
 */
function localeAwareCaseSensitiveSortFunction<TData>(
    rowA: TanStackRow<TData>,
    rowB: TanStackRow<TData>,
    columnId: string
): number {
    const valueA = rowA.getValue<string | null | undefined>(columnId);
    const valueB = rowB.getValue<string | null | undefined>(columnId);

    if (typeof valueA === 'string' && typeof valueB === 'string') {
        return valueA.localeCompare(valueB);
    }
    if (valueA === valueB) {
        return 0;
    }
    if (
        valueA === undefined
            || (valueA === null && valueB !== undefined)
    ) {
        return -1;
    }
    return 1;
}
