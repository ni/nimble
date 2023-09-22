import type { Row as TanStackRow, SortingFn } from '@tanstack/table-core';
import { TableColumnSortOperation } from '../../../table-column/base/types';
import { getTanStackSortingFunction } from '../sort-operations';
import type { TableFieldValue } from '../../types';

describe('Sort Operations', () => {
    function createFakeRow(
        value: TableFieldValue
    ): TanStackRow<TableFieldValue> {
        const row = jasmine.createSpyObj<TanStackRow<TableFieldValue>>(
            'TanStackRow',
            ['getValue']
        );
        row.getValue.and.returnValue(value);
        return row;
    }

    const basicNumericSortOrder = [
        { value: undefined, name: 'undefined' },
        { value: null, name: 'null' },
        { value: Number.NEGATIVE_INFINITY, name: '-∞' },
        { value: Number.MIN_SAFE_INTEGER, name: 'MIN_SAFE_INTEGER' },
        { value: -9999, name: '-9999' },
        { value: -3, name: '-3' },
        { value: 0, name: '0' },
        { value: Number.EPSILON, name: 'EPSILON' },
        { value: 3, name: '3' },
        { value: 9999, name: '9999' },
        { value: Number.MAX_SAFE_INTEGER, name: 'MAX_SAFE_INTEGER' },
        { value: Number.POSITIVE_INFINITY, name: '∞' }
    ] as const;
    const basicBooleanSortOrder = [
        { value: undefined, name: 'undefined' },
        { value: null, name: 'null' },
        { value: false, name: 'false' },
        { value: true, name: 'true' }
    ] as const;
    const basicStringSortOrder = [
        { value: undefined, name: 'undefined' },
        { value: null, name: 'null' },
        { value: '', name: "''" },
        { value: 'abc', name: 'abc' },
        { value: 'zzz', name: 'zzz' }
    ] as const;

    const localeAwareCaseSensitiveSortOrder = [
        { value: undefined, name: 'undefined' },
        { value: null, name: 'null' },
        { value: '', name: "''" },
        { value: 'abc', name: 'abc' },
        { value: 'ABC', name: 'ABC' },
        { value: 'hello world', name: 'hello WORLD' },
        { value: 'xyz', name: 'xyz' }
    ];

    const sortOrderTestCases = [
        {
            sortOperation: TableColumnSortOperation.basic,
            testCases: [
                basicNumericSortOrder,
                basicBooleanSortOrder,
                basicStringSortOrder
            ]
        },
        {
            sortOperation: TableColumnSortOperation.localeAwareCaseSensitive,
            testCases: [localeAwareCaseSensitiveSortOrder]
        }
    ] as const;
    for (const sortOrderTestCase of sortOrderTestCases) {
        for (const expectedSortOrder of sortOrderTestCase.testCases) {
            for (let i = 0; i < expectedSortOrder.length; i++) {
                for (let j = 0; j < expectedSortOrder.length; j++) {
                    const sortOrderA = expectedSortOrder[i]!;
                    const sortOrderB = expectedSortOrder[j]!;
                    it(`comparing ${sortOrderA.name} to ${sortOrderB.name} returns expected value`, () => {
                        let expectedSortResult: number;
                        if (i === j) {
                            expectedSortResult = 0;
                        } else if (i > j) {
                            expectedSortResult = 1;
                        } else {
                            expectedSortResult = -1;
                        }

                        const sortFunction = getTanStackSortingFunction(
                            sortOrderTestCase.sortOperation
                        ) as SortingFn<TableFieldValue>;
                        const rowA = createFakeRow(sortOrderA.value);
                        const rowB = createFakeRow(sortOrderB.value);
                        expect(sortFunction(rowA, rowB, '')).toBe(
                            expectedSortResult
                        );
                    });
                }
            }
        }
    }
});
