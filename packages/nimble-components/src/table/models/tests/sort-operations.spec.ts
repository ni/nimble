import type { Row as TanStackRow, SortingFn } from '@tanstack/table-core';
import { parameterizeSpec } from '@ni/jasmine-parameterized';
import { TableColumnSortOperation } from '../../../table-column/base/types';
import { getTanStackSortingFunction } from '../sort-operations';
import type { TableFieldValue } from '../../types';

describe('Sort Operations', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    function createSpyObj(methods: string[]): any {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const obj: any = {};
        for (const method of methods) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            obj[method] = vi.fn();
        }
        return obj;
    }

    function createFakeRow(
        value: TableFieldValue
    ): TanStackRow<TableFieldValue> {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const row = createSpyObj(['getValue']);
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
        row.getValue.mockReturnValue(value);
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return row;
    }

    // The `expectedSortOrder` arrays in the test cases are ordered from smallest value
    // to largest value. The tests call the sort operation on each index of each array
    // with every index in the same array and verify that it returns the correct value.
    const testCases = [
        {
            name: 'basic sorting with numbers',
            sortOperation: TableColumnSortOperation.basic,
            expectedSortOrder: [
                undefined,
                null,
                Number.NaN,
                Number.NEGATIVE_INFINITY,
                Number.MIN_SAFE_INTEGER,
                -9999,
                -3,
                -Number.EPSILON,
                -0,
                0,
                Number.EPSILON,
                3,
                9999,
                Number.MAX_SAFE_INTEGER,
                Number.POSITIVE_INFINITY
            ]
        },
        {
            name: 'basic sorting with booleans',
            sortOperation: TableColumnSortOperation.basic,
            expectedSortOrder: [undefined, null, false, true]
        },
        {
            name: 'basic sorting with strings',
            sortOperation: TableColumnSortOperation.basic,
            expectedSortOrder: [undefined, null, '', 'abc', 'zzz']
        },
        {
            name: 'locale aware case sensitive sorting',
            sortOperation: TableColumnSortOperation.localeAwareCaseSensitive,
            expectedSortOrder: [
                undefined,
                null,
                '',
                'abc',
                'ABC',
                'hello world',
                'xyz'
            ]
        }
    ] as const;
    parameterizeSpec(testCases, (spec, name, value) => {
        spec(name, () => {
            for (let i = 0; i < value.expectedSortOrder.length; i++) {
                for (let j = 0; j < value.expectedSortOrder.length; j++) {
                    const valueA = value.expectedSortOrder[i]!;
                    const valueB = value.expectedSortOrder[j]!;

                    let expectedSortResult: number;
                    if (i === j) {
                        expectedSortResult = 0;
                    } else if (i > j) {
                        expectedSortResult = 1;
                    } else {
                        expectedSortResult = -1;
                    }

                    const sortFunction = getTanStackSortingFunction(
                        value.sortOperation
                    ) as SortingFn<TableFieldValue>;
                    const rowA = createFakeRow(valueA);
                    const rowB = createFakeRow(valueB);
                    expect(sortFunction(rowA, rowB, '')).toBe(
                        expectedSortResult
                    );
                }
            }
        });
    });
});
