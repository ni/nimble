import { html } from '@microsoft/fast-element';
import { TableHeader } from '..';
import { waitForUpdatesAsync } from '../../../../testing/async-helpers';
import { type Fixture, fixture } from '../../../../utilities/tests/fixture';
import { TableColumnSortDirection } from '../../../types';
import { TableHeaderPageObject } from './table-header-pageobject';

async function setup(): Promise<Fixture<TableHeader>> {
    return fixture<TableHeader>(
        html`<nimble-table-header> </nimble-table-header>`
    );
}

describe('TableHeader', () => {
    let element: TableHeader;
    let pageObject: TableHeaderPageObject;
    let connect: () => Promise<void>;
    let disconnect: () => Promise<void>;

    beforeEach(async () => {
        ({ element, connect, disconnect } = await setup());
        pageObject = new TableHeaderPageObject(element);
        await connect();
    });

    afterEach(async () => {
        await disconnect();
    });

    it('can construct an element instance', () => {
        // prettier-ignore
        expect(document.createElement('nimble-table-header')).toBeInstanceOf(TableHeader);
    });

    it('has role of columnheader', () => {
        expect(element.getAttribute('role')).toBe('columnheader');
    });

    it('defaults to not sorted', () => {
        expect(element.sortDirection).toBe(TableColumnSortDirection.none);
    });

    it('has correct state when not sorted', () => {
        expect(element.hasAttribute('aria-sort')).toBeFalse();
        expect(pageObject.isSortAscendingIconVisible()).toBeFalse();
        expect(pageObject.isSortDescendingIconVisible()).toBeFalse();
    });

    // Firefox skipped, see: https://github.com/ni/nimble/issues/1075
    it('has correct state when sorted ascending #SkipFirefox', async () => {
        element.sortDirection = TableColumnSortDirection.ascending;
        element.firstSortedColumn = true;
        await waitForUpdatesAsync();

        expect(element.getAttribute('aria-sort')).toEqual('ascending');
        expect(pageObject.isSortAscendingIconVisible()).toBeTrue();
        expect(pageObject.isSortDescendingIconVisible()).toBeFalse();
    });

    // Firefox skipped, see: https://github.com/ni/nimble/issues/1075
    it('has correct state when sorted descending #SkipFirefox', async () => {
        element.sortDirection = TableColumnSortDirection.descending;
        element.firstSortedColumn = true;
        await waitForUpdatesAsync();

        expect(element.getAttribute('aria-sort')).toEqual('descending');
        expect(pageObject.isSortAscendingIconVisible()).toBeFalse();
        expect(pageObject.isSortDescendingIconVisible()).toBeTrue();
    });

    it('does not configure aria-sort if it is not the first sorted column', async () => {
        element.sortDirection = TableColumnSortDirection.descending;
        element.firstSortedColumn = false;
        await waitForUpdatesAsync();

        expect(element.hasAttribute('aria-sort')).toBeFalse();
        expect(pageObject.isSortAscendingIconVisible()).toBeFalse();
        expect(pageObject.isSortDescendingIconVisible()).toBeTrue();
    });

    it('displays grouping indicator icon when grouped', async () => {
        element.isGrouped = true;
        await waitForUpdatesAsync();

        expect(pageObject.isGroupIndicatorIconVisible()).toBeTrue();
    });

    it('grouping indicator icon is not shown when not grouped', () => {
        expect(element.isGrouped).toBeFalse();
        expect(pageObject.isGroupIndicatorIconVisible()).toBeFalse();
    });
});
