import { customElement } from '@ni/fast-element';
import {
    fixture,
    type Fixture,
    uniqueElementName
} from '../../../utilities/tests/fixture';
import {
    TableColumnEmpty,
    tableColumnEmptyCellViewTag,
    tableColumnEmptyGroupHeaderViewTag,
    tableColumnEmptyTag
} from './table-column.fixtures';
import { TableColumn } from '..';
import type { ColumnInternalsOptions } from '../models/column-internals';
import { ColumnValidator } from '../models/column-validator';

async function setup(): Promise<Fixture<TableColumnEmpty>> {
    return await fixture(tableColumnEmptyTag);
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

    describe('with a custom constructor', () => {
        // Seems subject to change how errors are handled during custom
        // element construction: https://github.com/WICG/webcomponents/issues/635
        // Right now they are propagated to the global error handler.

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
                        delegatedEvents: [],
                        validator: new ColumnValidator<[]>([])
                    };
                }
            }

            it('throws when instantiated', async () => {
                await jasmine.spyOnGlobalErrorsAsync(async globalErrorSpy => {
                    document.createElement(columnName);
                    await Promise.resolve();
                    expect(globalErrorSpy).toHaveBeenCalledTimes(1);
                    expect(
                        globalErrorSpy.calls.first().args[0].message
                    ).toMatch(
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
                        delegatedEvents: [],
                        validator: new ColumnValidator<[]>([])
                    };
                }
            }

            it('throws when instantiated', async () => {
                await jasmine.spyOnGlobalErrorsAsync(async globalErrorSpy => {
                    document.createElement(columnName);
                    await Promise.resolve();
                    expect(globalErrorSpy).toHaveBeenCalledTimes(1);
                    expect(
                        globalErrorSpy.calls.first().args[0].message
                    ).toMatch(
                        'must evaluate to an element extending TableGroupHeaderView'
                    );
                });
            });
        });
    });
});
