import { customElement, html } from '@ni/fast-element';
import { tableTag, type Table } from '..';
import { TableColumn } from '../../table-column/base';
import { tableColumnTextCellViewTag } from '../../table-column/text/cell-view';
import { tableColumnTextGroupHeaderViewTag } from '../../table-column/text/group-header-view';
import { waitForUpdatesAsync } from '../../testing/async-helpers';
import {
    type Fixture,
    fixture,
    uniqueElementName
} from '../../utilities/tests/fixture';
import type { TableRecord } from '../types';
import { TablePageObject } from '../testing/table.pageobject';
import type { ColumnInternalsOptions } from '../../table-column/base/models/column-internals';
import { ColumnValidator } from '../../table-column/base/models/column-validator';

interface SimpleTableRecord extends TableRecord {
    foo: string;
}

const columnName = uniqueElementName();
@customElement({
    name: columnName
})
// eslint-disable-next-line @typescript-eslint/no-unused-vars
class TestTableColumn extends TableColumn {
    protected override getColumnInternalsOptions(): ColumnInternalsOptions {
        return {
            cellRecordFieldNames: ['value'],
            cellViewTag: tableColumnTextCellViewTag,
            groupHeaderViewTag: tableColumnTextGroupHeaderViewTag,
            delegatedEvents: ['click', 'keydown'],
            validator: new ColumnValidator<[]>([])
        };
    }
}

// prettier-ignore
async function setup(): Promise<Fixture<Table<SimpleTableRecord>>> {
    return await fixture<Table<SimpleTableRecord>>(
        html`<${tableTag}>
            <${columnName}>Column</${columnName}>
        </${tableTag}>`
    );
}

describe('Table delegated events', () => {
    let element: Table<SimpleTableRecord>;
    let connect: () => Promise<void>;
    let disconnect: () => Promise<void>;
    let pageObject: TablePageObject<SimpleTableRecord>;
    let column1: TestTableColumn;

    beforeEach(async () => {
        ({ element, connect, disconnect } = await setup());
        pageObject = new TablePageObject<SimpleTableRecord>(element);
        column1 = element.querySelector<TestTableColumn>(columnName)!;
    });

    afterEach(async () => {
        await disconnect();
    });

    it('dispatches original event to column', async () => {
        const data: readonly SimpleTableRecord[] = [{ foo: '1' }] as const;

        await element.setData(data);
        await connect();
        await waitForUpdatesAsync();
        const spy = jasmine.createSpy();
        column1.addEventListener('delegated-event', spy);
        const clickEvent = new PointerEvent('click', {
            bubbles: true,
            composed: true
        });
        pageObject.dispatchEventToCell(0, 0, clickEvent);
        expect(spy).toHaveBeenCalledOnceWith(
            jasmine.objectContaining({
                detail: { originalEvent: clickEvent, recordId: '0' }
            })
        );
    });

    it('allows original event to continue bubbling to table by default', async () => {
        const data: readonly SimpleTableRecord[] = [{ foo: '1' }] as const;

        await element.setData(data);
        await connect();
        await waitForUpdatesAsync();
        let bubbledEvent: Event | null = null;
        element.addEventListener('click', event => {
            bubbledEvent = event;
        });
        const clickEvent = new PointerEvent('click', {
            bubbles: true,
            composed: true
        });
        pageObject.dispatchEventToCell(0, 0, clickEvent);
        expect(bubbledEvent!).toBe(clickEvent);
    });

    it('delegates all specified event types with default record ids', async () => {
        const data: readonly SimpleTableRecord[] = [{ foo: '1' }] as const;

        await element.setData(data);
        await connect();
        await waitForUpdatesAsync();
        const spy = jasmine.createSpy();
        column1.addEventListener('delegated-event', spy);
        const clickEvent = new PointerEvent('click', {
            bubbles: true,
            composed: true
        });
        pageObject.dispatchEventToCell(0, 0, clickEvent);
        expect(spy).toHaveBeenCalledOnceWith(
            jasmine.objectContaining({
                detail: { originalEvent: clickEvent, recordId: '0' }
            })
        );

        spy.calls.reset();
        const keydownEvent = new KeyboardEvent('keydown', {
            bubbles: true,
            composed: true
        });
        pageObject.dispatchEventToCell(0, 0, keydownEvent);
        expect(spy).toHaveBeenCalledOnceWith(
            jasmine.objectContaining({
                detail: { originalEvent: keydownEvent, recordId: '0' }
            })
        );
    });

    it('does not delegate unspecified event types', async () => {
        const data: readonly SimpleTableRecord[] = [{ foo: '1' }] as const;

        await element.setData(data);
        await connect();
        await waitForUpdatesAsync();
        let gotDelegatedEvent = false;
        column1.addEventListener('delegated-event', () => {
            gotDelegatedEvent = true;
        });
        const mouseoverEvent = new MouseEvent('mouseover', {
            bubbles: true,
            composed: true
        });
        pageObject.dispatchEventToCell(0, 0, mouseoverEvent);
        expect(gotDelegatedEvent).toBeFalse();
    });

    it('delegates events with specified record ids', async () => {
        element.idFieldName = 'id';
        const data: readonly SimpleTableRecord[] = [
            { id: '1234', foo: '1' }
        ] as const;

        await element.setData(data);
        await connect();
        await waitForUpdatesAsync();
        const spy = jasmine.createSpy();
        column1.addEventListener('delegated-event', spy);
        const clickEvent = new PointerEvent('click', {
            bubbles: true,
            composed: true
        });
        pageObject.dispatchEventToCell(0, 0, clickEvent);
        expect(spy).toHaveBeenCalledOnceWith(
            jasmine.objectContaining({
                detail: { originalEvent: clickEvent, recordId: '1234' }
            })
        );
    });
});
