import { html } from '@microsoft/fast-element';
import { TableHeader } from '..';
import { iconArrowDownTag } from '../../../../icons/arrow-down';
import { iconArrowUpTag } from '../../../../icons/arrow-up';
import { waitForUpdatesAsync } from '../../../../testing/async-helpers';
import { type Fixture, fixture } from '../../../../utilities/tests/fixture';
import { TableColumnSortDirection } from '../../../types';

async function setup(): Promise<Fixture<TableHeader>> {
    return fixture<TableHeader>(
        html`<nimble-table-header> </nimble-table-header>`
    );
}

function getSortIcons(element: TableHeader): {
    ascendingIcon: HTMLElement | null,
    descendingIcon: HTMLElement | null
} {
    return {
        ascendingIcon: element.shadowRoot!.querySelector(
            `${iconArrowUpTag}.sort-indicator`
        ),
        descendingIcon: element.shadowRoot!.querySelector(
            `${iconArrowDownTag}.sort-indicator`
        )
    };
}

describe('TableHeader', () => {
    let element: TableHeader;
    let connect: () => Promise<void>;
    let disconnect: () => Promise<void>;

    beforeEach(async () => {
        ({ element, connect, disconnect } = await setup());
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
        const sortIcons = getSortIcons(element);
        expect(sortIcons.ascendingIcon).toBeFalsy();
        expect(sortIcons.descendingIcon).toBeFalsy();
    });

    // Firefox skipped, see: https://github.com/ni/nimble/issues/1075
    it('has correct state when sorted ascending #SkipFirefox', async () => {
        element.sortDirection = TableColumnSortDirection.ascending;
        element.firstSortedColumn = true;
        await waitForUpdatesAsync();

        expect(element.getAttribute('aria-sort')).toEqual('ascending');
        const sortIcons = getSortIcons(element);
        expect(sortIcons.ascendingIcon).toBeTruthy();
        expect(sortIcons.descendingIcon).toBeFalsy();
    });

    // Firefox skipped, see: https://github.com/ni/nimble/issues/1075
    it('has correct state when sorted descending #SkipFirefox', async () => {
        element.sortDirection = TableColumnSortDirection.descending;
        element.firstSortedColumn = true;
        await waitForUpdatesAsync();

        expect(element.getAttribute('aria-sort')).toEqual('descending');
        const sortIcons = getSortIcons(element);
        expect(sortIcons.ascendingIcon).toBeFalsy();
        expect(sortIcons.descendingIcon).toBeTruthy();
    });

    it('does not configure aria-sort if it is not the first sorted column', async () => {
        element.sortDirection = TableColumnSortDirection.descending;
        element.firstSortedColumn = false;
        await waitForUpdatesAsync();

        expect(element.hasAttribute('aria-sort')).toBeFalse();
        const sortIcons = getSortIcons(element);
        expect(sortIcons.ascendingIcon).toBeFalsy();
        expect(sortIcons.descendingIcon).toBeTruthy();
    });

    it('displays grouping indicator icon when grouped', async () => {
        element.isGrouped = true;
        await waitForUpdatesAsync();

        const groupingIndicatorIcon = element.shadowRoot?.querySelector('.grouped-indicator');
        expect(groupingIndicatorIcon).toBeTruthy();
    });

    it('grouping indicator icon is not shown when not grouped', () => {
        expect(element.isGrouped).toBeFalse();
        const groupingIndicatorIcon = element.shadowRoot?.querySelector('.grouped-indicator');
        expect(groupingIndicatorIcon).toBeFalsy();
    });
});
