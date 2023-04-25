import { fixture, Fixture } from '../../../utilities/tests/fixture';
import type { TableCellView } from '../cell-view';
import type { DelegatedEventEventDetails } from '../types';
import {
    tableColumnEmptyCellViewTag,
    TableColumnDelegatesClickAndKeydown,
    TableColumnEmpty
} from './table-column.fixtures';

async function setup(): Promise<Fixture<TableCellView>> {
    return fixture(tableColumnEmptyCellViewTag);
}

describe('TableCellView', () => {
    let element: TableCellView;
    let connect: () => Promise<void>;
    let disconnect: () => Promise<void>;

    beforeEach(async () => {
        ({ element, connect, disconnect } = await setup());
    });

    afterEach(async () => {
        await disconnect();
    });

    it('delegates event(s) configured by assigned column', async () => {
        await connect();
        // Configure column that delegates click and keydown
        const delegatingColumn = new TableColumnDelegatesClickAndKeydown();
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
        const emptyColumn = new TableColumnEmpty();
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
});
