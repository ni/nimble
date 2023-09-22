import type {
    SortingFnOption as TanStackSortingFnOption,
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
            return basicSortFunction;
        case TableColumnSortOperation.localeAwareCaseSensitive:
            return localeAwareCaseSensitiveSortFunction;
        default:
            return basicSortFunction;
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
    if (valueA === undefined || (valueA === null && valueB !== undefined)) {
        return -1;
    }
    return 1;
}

/**
 * A function to perform a basic sort of two rows from TanStack for a given column.
 * The function sorts `undefined` followed by `null` before all other values that are
 * ordered using the `>` operator.
 */
function basicSortFunction<TData>(
    rowA: TanStackRow<TData>,
    rowB: TanStackRow<TData>,
    columnId: string
): number {
    const valueA = rowA.getValue<string | number | boolean | null | undefined>(
        columnId
    );
    const valueB = rowB.getValue<string | number | boolean | null | undefined>(
        columnId
    );

    if (valueA === valueB) {
        return 0;
    }
    if (valueA === undefined) {
        return -1;
    }
    if (valueB === undefined) {
        return 1;
    }
    if (valueA === null) {
        return -1;
    }
    if (valueB === null) {
        return 1;
    }

    return valueA > valueB ? 1 : -1;
}
