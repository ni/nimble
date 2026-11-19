import type {
    SortFn as TanStackSortFn,
    Row as TanStackRow,
    RowData
} from '@tanstack/table-core';
import { TableColumnSortOperation } from '../../table-column/base/types';
import type { TableFieldValue } from '../types';
import type { TanStackTableFeatures } from './tanstack-table-features';

/**
 * Returns the sorting function for TanStack to use based on the specified
 * TableColumnSortOperation
 */
export function getTanStackSortingFunction<TData extends RowData>(
    sortOperation: TableColumnSortOperation
): TanStackSortFn<TanStackTableFeatures, TData> {
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
function localeAwareCaseSensitiveSortFunction<TData extends RowData>(
    rowA: TanStackRow<TanStackTableFeatures, TData>,
    rowB: TanStackRow<TanStackTableFeatures, TData>,
    columnId: string
): number {
    const valueA = getSortValue<string | null | undefined, TData>(rowA, columnId);
    const valueB = getSortValue<string | null | undefined, TData>(rowB, columnId);

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
 * The function sorts `undefined` followed by `null` before all other values.
 */
function basicSortFunction<TData extends RowData>(
    rowA: TanStackRow<TanStackTableFeatures, TData>,
    rowB: TanStackRow<TanStackTableFeatures, TData>,
    columnId: string
): number {
    const valueA = getSortValue<TableFieldValue, TData>(rowA, columnId);
    const valueB = getSortValue<TableFieldValue, TData>(rowB, columnId);

    if (Object.is(valueA, valueB)) {
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
    if (Number.isNaN(valueA)) {
        return -1;
    }
    if (Number.isNaN(valueB)) {
        return 1;
    }

    if (valueA === 0 && valueB === 0) {
        // Both values equal 0, but one is -0 and one is +0 because Object.is(valueA, valueB) returned false.
        return Object.is(valueA, -0) ? -1 : 1;
    }
    return valueA > valueB ? 1 : -1;
}

function getSortValue<TValue, TData extends RowData>(
    row: TanStackRow<TanStackTableFeatures, TData>,
    columnId: string
): TValue {
    // v8 exposed the first descendant's value for later grouped columns.
    // v9 only exposes grouped values at or above the current grouping depth.
    if (row.getIsGrouped() && row.table.atoms.grouping.get().indexOf(columnId) > row.depth) {
        const firstChild = row.subRows[0];
        if (firstChild) {
            return getSortValue<TValue, TData>(firstChild, columnId);
        }
    }
    return row.getValue<TValue>(columnId);
}
