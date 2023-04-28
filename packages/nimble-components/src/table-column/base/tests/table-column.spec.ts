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

    describe('with a custom constructor', () => {
        // Seems subject to change how errors are handled during custom
        // element construction: https://github.com/WICG/webcomponents/issues/635
        // Right now they are propagated to the global error handler.

        // Manually cast the globalErrorSpy
        // See: https://github.com/DefinitelyTyped/DefinitelyTyped/issues/61819#issuecomment-1502152632
        function castSpy(spy: Error): jasmine.Spy<(err: Error) => void> {
            return spy as unknown as jasmine.Spy<(err: Error) => void>;
        }

        describe('that is a default constructor without ColumnInternalsOptions', () => {
            const columnName = uniqueElementName();
            @customElement({
                name: columnName
            })
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            class TestTableColumn extends TableColumn {}

            it('throws when instantiated', async () => {
                await jasmine.spyOnGlobalErrorsAsync(async globalErrorSpy => {
                    const spy = castSpy(globalErrorSpy);
                    document.createElement(columnName);
                    await Promise.resolve();
                    expect(spy).toHaveBeenCalledTimes(1);
                    expect(spy.calls.first().args[0].message).toMatch(
                        'ColumnInternalsOptions must be provided'
                    );
                });
            });
        });

        describe('that passes an invalid cellViewTag', () => {
            const columnName = uniqueElementName();
            @customElement({
                name: columnName
            })
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            class TestTableColumn extends TableColumn {
                public constructor() {
                    super({
                        cellRecordFieldNames: [],
                        cellViewTag: 'div',
                        groupHeaderViewTag: tableColumnEmptyGroupHeaderViewTag,
                        delegatedEvents: []
                    });
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
                public constructor() {
                    super({
                        cellRecordFieldNames: [],
                        cellViewTag: tableColumnEmptyCellViewTag,
                        groupHeaderViewTag: 'div',
                        delegatedEvents: []
                    });
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
