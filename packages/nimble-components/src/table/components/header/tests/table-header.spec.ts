import { html } from '@microsoft/fast-element';
import { TableHeader, tableHeaderTag } from '..';
import { waitForUpdatesAsync } from '../../../../testing/async-helpers';
import { type Fixture, fixture } from '../../../../utilities/tests/fixture';
import { TableColumnAlignment, TableColumnSortDirection } from '../../../types';
import { TableHeaderPageObject } from './table-header-pageobject';

async function setup(): Promise<Fixture<TableHeader>> {
    return await fixture<TableHeader>(
        html`<${tableHeaderTag}> </${tableHeaderTag}>`
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
        expect(document.createElement(tableHeaderTag)).toBeInstanceOf(
            TableHeader
        );
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

    it('has correct state when sorted ascending', async () => {
        element.sortDirection = TableColumnSortDirection.ascending;
        element.firstSortedColumn = true;
        await waitForUpdatesAsync();

        expect(element.getAttribute('aria-sort')).toEqual('ascending');
        expect(pageObject.isSortAscendingIconVisible()).toBeTrue();
        expect(pageObject.isSortDescendingIconVisible()).toBeFalse();
    });

    it('has correct state when sorted descending', async () => {
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

    it('sorting and grouping indicators are hidden when indicators-hidden is true', async () => {
        element.isGrouped = true;
        element.sortDirection = TableColumnSortDirection.ascending;
        element.firstSortedColumn = true;
        element.indicatorsHidden = true;
        await waitForUpdatesAsync();

        expect(pageObject.isSortAscendingIconVisible()).toBeFalse();
        expect(pageObject.isSortDescendingIconVisible()).toBeFalse();
        expect(pageObject.isGroupIndicatorIconVisible()).toBeFalse();
    });

    it('sorting and grouping indicators become visible when indicators-hidden changes from true to false', async () => {
        element.isGrouped = true;
        element.sortDirection = TableColumnSortDirection.ascending;
        element.firstSortedColumn = true;
        element.indicatorsHidden = true;
        await waitForUpdatesAsync();

        expect(pageObject.isSortAscendingIconVisible()).toBeFalse();
        expect(pageObject.isSortDescendingIconVisible()).toBeFalse();
        expect(pageObject.isGroupIndicatorIconVisible()).toBeFalse();

        element.indicatorsHidden = false;
        await waitForUpdatesAsync();

        expect(pageObject.isSortAscendingIconVisible()).toBeTrue();
        expect(pageObject.isSortDescendingIconVisible()).toBeFalse();
        expect(pageObject.isGroupIndicatorIconVisible()).toBeTrue();
    });

    it('sorting and grouping indicators become hidden when indicators-hidden changes from false to true', async () => {
        element.isGrouped = true;
        element.sortDirection = TableColumnSortDirection.ascending;
        element.firstSortedColumn = true;
        await waitForUpdatesAsync();

        expect(pageObject.isSortAscendingIconVisible()).toBeTrue();
        expect(pageObject.isSortDescendingIconVisible()).toBeFalse();
        expect(pageObject.isGroupIndicatorIconVisible()).toBeTrue();

        element.indicatorsHidden = true;
        await waitForUpdatesAsync();

        expect(pageObject.isSortAscendingIconVisible()).toBeFalse();
        expect(pageObject.isSortDescendingIconVisible()).toBeFalse();
        expect(pageObject.isGroupIndicatorIconVisible()).toBeFalse();
    });

    it('configures aria-sort when sorting indicator is hidden', async () => {
        element.sortDirection = TableColumnSortDirection.descending;
        element.firstSortedColumn = true;
        element.indicatorsHidden = true;
        await waitForUpdatesAsync();

        expect(element.getAttribute('aria-sort')).toEqual('descending');
        expect(pageObject.isSortAscendingIconVisible()).toBeFalse();
        expect(pageObject.isSortDescendingIconVisible()).toBeFalse();
    });

    it('defaults to left-aligned', () => {
        expect(element.alignment).toBe(TableColumnAlignment.left);
    });
});
