import { customElement } from '@microsoft/fast-element';
import { TableColumn } from '..';
import {
    fixture,
    Fixture,
    uniqueElementName
} from '../../../utilities/tests/fixture';
import type { TableCellView } from '../cell-view';
import type { DelegatedEventEventDetails } from '../types';
import {
    tableColumnEmptyCellViewTag,
    tableColumnEmptyGroupHeaderViewTag,
    tableColumnEmptyTag
} from './table-column.fixtures';
import type { ColumnInternalsOptions } from '../models/column-internals';

async function setup(): Promise<Fixture<TableCellView>> {
    return fixture(tableColumnEmptyCellViewTag);
}

describe('TableCellView', () => {
    let element: TableCellView;
    let connect: () => Promise<void>;
    let disconnect: () => Promise<void>;

    const tableColumnDelegatesClickAndKeydownTag = uniqueElementName();
    /**
     * Simple empty table column with 'click' and 'keydown' event delegation for testing
     */
    @customElement({
        name: tableColumnDelegatesClickAndKeydownTag
    })
    class TableColumnDelegatesClickAndKeydown extends TableColumn {
        protected override getColumnInternalsOptions(): ColumnInternalsOptions {
            return {
                cellRecordFieldNames: [],
                cellViewTag: tableColumnEmptyCellViewTag,
                groupHeaderViewTag: tableColumnEmptyGroupHeaderViewTag,
                delegatedEvents: ['click', 'keydown']
            };
        }
    }

    beforeEach(async () => {
        ({ element, connect, disconnect } = await setup());
    });

    afterEach(async () => {
        await disconnect();
    });

    it('delegates event(s) configured by assigned column', async () => {
        await connect();
        // Configure column that delegates click and keydown
        const delegatingColumn = document.createElement(
            tableColumnDelegatesClickAndKeydownTag
        ) as TableColumnDelegatesClickAndKeydown;
        let gotClickOnDelegatingColumn = false;
        let gotKeydownOnDelegatingColumn = false;
        let gotOtherEventOnDelegatingColumn = false;
        delegatingColumn.addEventListener('delegated-event', event => {
            const delegatedEvent = (
                (event as CustomEvent).detail as DelegatedEventEventDetails
            ).originalEvent;
            if (delegatedEvent.type === 'click') {
                gotClickOnDelegatingColumn = true;
            } else if (delegatedEvent.type === 'keydown') {
                gotKeydownOnDelegatingColumn = true;
            } else {
                gotOtherEventOnDelegatingColumn = true;
            }
        });
        // Configure column that delegates no events
        const emptyColumn = document.createElement(tableColumnEmptyTag);
        let gotClickOnEmptyColumn = false;
        let gotKeydownOnEmptyColumn = false;
        let gotOtherEventOnEmptyColumn = false;
        emptyColumn.addEventListener('delegated-event', event => {
            const delegatedEvent = (
                (event as CustomEvent).detail as DelegatedEventEventDetails
            ).originalEvent;
            if (delegatedEvent.type === 'click') {
                gotClickOnEmptyColumn = true;
            } else if (delegatedEvent.type === 'keydown') {
                gotKeydownOnEmptyColumn = true;
            } else {
                gotOtherEventOnEmptyColumn = true;
            }
        });

        element.recordId = '0';
        element.column = delegatingColumn;
        element.dispatchEvent(new PointerEvent('click'));
        element.dispatchEvent(new KeyboardEvent('keydown'));
        element.dispatchEvent(new MouseEvent('mouseover'));
        expect(gotClickOnDelegatingColumn).toBeTrue();
        expect(gotKeydownOnDelegatingColumn).toBeTrue();
        expect(gotOtherEventOnDelegatingColumn).toBeFalse();
        element.column = emptyColumn; // should no longer delegate events to either column
        gotClickOnDelegatingColumn = false;
        gotKeydownOnDelegatingColumn = false;
        element.dispatchEvent(new PointerEvent('click'));
        element.dispatchEvent(new KeyboardEvent('keydown'));
        element.dispatchEvent(new MouseEvent('mouseover'));
        expect(gotClickOnEmptyColumn).toBeFalse();
        expect(gotKeydownOnEmptyColumn).toBeFalse();
        expect(gotOtherEventOnEmptyColumn).toBeFalse();
        expect(gotClickOnDelegatingColumn).toBeFalse();
        expect(gotKeydownOnDelegatingColumn).toBeFalse();
        expect(gotOtherEventOnDelegatingColumn).toBeFalse();
    });

    it('does not fire delegated event for cell with undefined row id', async () => {
        await connect();

        const column = document.createElement(
            tableColumnDelegatesClickAndKeydownTag
        ) as TableColumnDelegatesClickAndKeydown;
        const spy = jasmine.createSpy();
        column.addEventListener('delegated-event', spy);

        element.column = column;
        element.dispatchEvent(new PointerEvent('click'));

        expect(spy).not.toHaveBeenCalled();
    });

    it('passes record id in delegated event details', async () => {
        await connect();

        const column = document.createElement(
            tableColumnDelegatesClickAndKeydownTag
        ) as TableColumnDelegatesClickAndKeydown;
        const spy = jasmine.createSpy();
        column.addEventListener('delegated-event', spy);

        element.recordId = 'foo';
        element.column = column;
        element.dispatchEvent(new PointerEvent('click'));

        expect(spy).toHaveBeenCalledOnceWith(
            jasmine.objectContaining({
                detail: jasmine.objectContaining({ recordId: 'foo' })
            })
        );
    });
});
