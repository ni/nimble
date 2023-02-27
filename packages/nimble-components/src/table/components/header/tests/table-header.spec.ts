import { html } from '@microsoft/fast-element';
import { DesignSystem } from '@microsoft/fast-foundation';
import { TableHeader } from '..';
import { IconArrowDown } from '../../../../icons/arrow-down';
import { IconArrowUp } from '../../../../icons/arrow-up';
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
    const sortIndicatorContainer = element.shadowRoot!.querySelector('.sort-indicator')!;
    return {
        ascendingIcon: sortIndicatorContainer.querySelector(
            DesignSystem.tagFor(IconArrowUp)
        ),
        descendingIcon: sortIndicatorContainer.querySelector(
            DesignSystem.tagFor(IconArrowDown)
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

    it('has correct state when sorted ascending', async () => {
        element.sortDirection = TableColumnSortDirection.ascending;
        await waitForUpdatesAsync();

        expect(element.getAttribute('aria-sort')).toEqual('ascending');
        const sortIcons = getSortIcons(element);
        expect(sortIcons.ascendingIcon).toBeTruthy();
        expect(sortIcons.descendingIcon).toBeFalsy();
    });

    it('has correct state when sorted descending', async () => {
        element.sortDirection = TableColumnSortDirection.descending;
        await waitForUpdatesAsync();

        expect(element.getAttribute('aria-sort')).toEqual('descending');
        const sortIcons = getSortIcons(element);
        expect(sortIcons.ascendingIcon).toBeFalsy();
        expect(sortIcons.descendingIcon).toBeTruthy();
    });
});
