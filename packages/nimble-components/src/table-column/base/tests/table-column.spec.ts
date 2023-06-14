/* eslint-disable max-classes-per-file */
import { customElement } from '@microsoft/fast-element';
import {
    fixture,
    Fixture,
    uniqueElementName
} from '../../../utilities/tests/fixture';
import {
    TableColumnEmpty,
    tableColumnEmptyCellViewTag,
    tableColumnEmptyGroupHeaderViewTag,
    tableColumnEmptyTag
} from './table-column.fixtures';
import { TableColumn } from '..';
import { TableColumnSortDirection } from '../../../table/types';
import type { ColumnInternalsOptions } from '../models/column-internals';

async function setup(): Promise<Fixture<TableColumnEmpty>> {
    return fixture(tableColumnEmptyTag);
}

describe('TableColumn', () => {
    let element: TableColumnEmpty;
    let connect: () => Promise<void>;
    let disconnect: () => Promise<void>;

    beforeEach(async () => {
        ({ element, connect, disconnect } = await setup());
    });

    afterEach(async () => {
        await disconnect();
    });

    it('reports column configuration valid', async () => {
        await connect();

        expect(element.checkValidity()).toBeTrue();
    });

    it('setting columnInternals.fractionalWidth sets columnInternals.currentFractionalWidth', async () => {
        await connect();
        element.columnInternals.currentFractionalWidth = 1;

        element.columnInternals.fractionalWidth = 2;

        expect(element.columnInternals.currentFractionalWidth).toBe(2);
    });

    it('setting columnInternals.pixelWidth sets columnInternals.currentPixelWidth', async () => {
        await connect();
        element.columnInternals.currentPixelWidth = 100;

        element.columnInternals.pixelWidth = 200;

        expect(element.columnInternals.currentPixelWidth).toBe(200);
    });

    it('setting sortDirection sets columnInternals.currentSortDirection', async () => {
        await connect();
        element.sortDirection = TableColumnSortDirection.descending;

        expect(element.columnInternals.currentSortDirection).toBe(
            TableColumnSortDirection.descending
        );
    });

    it('setting sortIndex sets columnInternals.currentSortIndex', async () => {
        await connect();
        element.sortIndex = 1;

        expect(element.columnInternals.currentSortIndex).toBe(1);
    });

    it('disallows programmatic sorting when sortingDisabled is true', async () => {
        await connect();
        element.sortingDisabled = true;

        element.sortIndex = 0;
        element.sortDirection = TableColumnSortDirection.ascending;

        expect(element.columnInternals.currentSortIndex).toBeUndefined();
        expect(element.columnInternals.currentSortDirection).toEqual(
            TableColumnSortDirection.none
        );
    });

    it('if sortIndex/sortDirection are set when sortingDisabled is true, currentSortIndex/currentSortDirection will get those values when sortingDisabled is set to false', async () => {
        await connect();
        element.sortingDisabled = true;

        element.sortIndex = 0;
        element.sortDirection = TableColumnSortDirection.ascending;

        element.sortingDisabled = false;

        expect(element.columnInternals.currentSortIndex).toEqual(0);
        expect(element.columnInternals.currentSortDirection).toEqual(
            TableColumnSortDirection.ascending
        );
    });

    describe('with a custom constructor', () => {
        // Seems subject to change how errors are handled during custom
        // element construction: https://github.com/WICG/webcomponents/issues/635
        // Right now they are propagated to the global error handler.

        // Manually cast the globalErrorSpy
        // See: https://github.com/DefinitelyTyped/DefinitelyTyped/issues/61819#issuecomment-1502152632
        function castSpy(spy: Error): jasmine.Spy<(err: Error) => void> {
            return spy as unknown as jasmine.Spy<(err: Error) => void>;
        }

        describe('that passes an invalid cellViewTag', () => {
            const columnName = uniqueElementName();
            @customElement({
                name: columnName
            })
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            class TestTableColumn extends TableColumn {
                protected override getColumnInternalsOptions(): ColumnInternalsOptions {
                    return {
                        cellRecordFieldNames: [],
                        cellViewTag: 'div',
                        groupHeaderViewTag: tableColumnEmptyGroupHeaderViewTag,
                        delegatedEvents: []
                    };
                }
            }

            it('throws when instantiated', async () => {
                await jasmine.spyOnGlobalErrorsAsync(async globalErrorSpy => {
                    const spy = castSpy(globalErrorSpy);
                    document.createElement(columnName);
                    await Promise.resolve();
                    expect(spy).toHaveBeenCalledTimes(1);
                    expect(spy.calls.first().args[0].message).toMatch(
                        'must evaluate to an element extending TableCellView'
                    );
                });
            });
        });

        describe('that passes an invalid groupHeaderViewTag', () => {
            const columnName = uniqueElementName();
            @customElement({
                name: columnName
            })
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            class TestTableColumn extends TableColumn {
                protected override getColumnInternalsOptions(): ColumnInternalsOptions {
                    return {
                        cellRecordFieldNames: [],
                        cellViewTag: tableColumnEmptyCellViewTag,
                        groupHeaderViewTag: 'div',
                        delegatedEvents: []
                    };
                }
            }

            it('throws when instantiated', async () => {
                await jasmine.spyOnGlobalErrorsAsync(async globalErrorSpy => {
                    const spy = castSpy(globalErrorSpy);
                    document.createElement(columnName);
                    await Promise.resolve();
                    expect(spy).toHaveBeenCalledTimes(1);
                    expect(spy.calls.first().args[0].message).toMatch(
                        'must evaluate to an element extending TableGroupHeaderView'
                    );
                });
            });
        });
    });
});
