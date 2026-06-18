import { html } from '@ni/fast-element';
import { waitForUpdatesAsync } from '@ni/nimble-components/dist/esm/testing/async-helpers';
import { fixture, type Fixture } from '../../../utilities/tests/fixture';
import { FvMasterDetailList, fvMasterDetailListTag } from '..';
import { FvMasterDetailListItem, fvMasterDetailListItemTag } from '../../master-detail-list-item';

async function setup(): Promise<Fixture<FvMasterDetailList>> {
    return await fixture<FvMasterDetailList>(html`
        <${fvMasterDetailListTag} placeholder="Filter devices...">
            <${fvMasterDetailListItemTag}
                title-text="NI-DAQ-001"
                subtitle="USB-6001 · Lab A"
                value="daq-001"
                status-color="#169c44"
                status-label="Connected"
            ></${fvMasterDetailListItemTag}>
            <${fvMasterDetailListItemTag}
                title-text="NI-SCOPE-002"
                subtitle="PXIe-5162 · Lab B"
                value="scope-002"
                status-color="#169c44"
                status-label="Connected"
            ></${fvMasterDetailListItemTag}>
            <${fvMasterDetailListItemTag}
                title-text="NI-FGEN-003"
                subtitle="PXI-5421 · Storage"
                value="fgen-003"
            ></${fvMasterDetailListItemTag}>
            <${fvMasterDetailListItemTag}
                title-text="NI-DMM-004"
                subtitle="USB-4065 · Lab A"
                value="dmm-004"
                status-color="#169c44"
                status-label="Connected"
            ></${fvMasterDetailListItemTag}>
            <${fvMasterDetailListItemTag}
                title-text="NI-SWITCH-005"
                subtitle="PXI-2527 · Rack 3"
                value="switch-005"
                status-color="#ff5f0f"
                status-label="Pending changes"
            ></${fvMasterDetailListItemTag}>
            <${fvMasterDetailListItemTag}
                title-text="NI-SERIAL-006"
                subtitle="USB-485/2 · Lab C"
                value="serial-006"
                status-color="#169c44"
                status-label="Connected"
            ></${fvMasterDetailListItemTag}>
        </${fvMasterDetailListTag}>
    `);
}

function getRequiredShadowRoot(element: HTMLElement): ShadowRoot {
    if (!element.shadowRoot) {
        throw new Error('Expected shadow root to exist');
    }

    return element.shadowRoot;
}

describe('FvMasterDetailList', () => {
    let element: FvMasterDetailList;
    let connect: () => Promise<void>;
    let disconnect: (() => Promise<void>) | undefined;

    function getRequiredElement<T extends Element>(selector: string): T {
        const foundElement = getRequiredShadowRoot(element).querySelector<T>(selector);

        if (!foundElement) {
            throw new Error(`Expected element matching selector ${selector}`);
        }

        return foundElement;
    }

    function getItemByTitle(title: string): FvMasterDetailListItem {
        const item = Array.from(element.querySelectorAll<FvMasterDetailListItem>(fvMasterDetailListItemTag)).find(
            currentItem => currentItem.titleText === title
        );

        if (!item) {
            throw new Error(`Expected item with title ${title}`);
        }

        return item;
    }

    afterEach(async () => {
        await disconnect?.();
        disconnect = undefined;
    });

    it('can construct a list instance', () => {
        expect(document.createElement(fvMasterDetailListTag)).toBeInstanceOf(FvMasterDetailList);
    });

    it('can construct a list item instance', () => {
        expect(document.createElement(fvMasterDetailListItemTag)).toBeInstanceOf(FvMasterDetailListItem);
    });

    it('selects the first visible item by default', async () => {
        ({ element, connect, disconnect } = await setup());
        await connect();
        await waitForUpdatesAsync();

        expect(getItemByTitle('NI-DAQ-001').selected).toBeTrue();
        expect(getItemByTitle('NI-SCOPE-002').selected).toBeFalse();
        expect(getRequiredElement<HTMLInputElement>('.filter-input').getAttribute('aria-activedescendant')).toBe(
            getItemByTitle('NI-DAQ-001').id
        );
    });

    it('renders item title, subtitle, and a fallback status icon', async () => {
        const itemFixture = await fixture<FvMasterDetailListItem>(html`
            <${fvMasterDetailListItemTag}
                title-text="NI-DAQ-001"
                subtitle="USB-6001 · Lab A"
                status-color="#169c44"
                status-label="Connected"
            ></${fvMasterDetailListItemTag}>
        `);
        const { element: item, connect: connectItem, disconnect: disconnectItem } = itemFixture;

        try {
            await connectItem();
            await waitForUpdatesAsync();

            expect(item.shadowRoot?.querySelector('.title')?.textContent?.trim()).toBe('NI-DAQ-001');
            expect(item.shadowRoot?.querySelector('.subtitle')?.textContent?.trim()).toBe('USB-6001 · Lab A');
            const statusIcon = item.shadowRoot?.querySelector('nimble-icon-circle-filled');

            expect(statusIcon?.getAttribute('style')).toContain('#169c44');
            expect(statusIcon?.getAttribute('aria-label')).toBe('Connected');
        } finally {
            await disconnectItem?.();
        }
    });

    it('supports a compact item layout', async () => {
        const itemFixture = await fixture<FvMasterDetailListItem>(html`
            <${fvMasterDetailListItemTag}
                title-text="NI-DAQ-001"
                subtitle="USB-6001 · Lab A"
                compact
            ></${fvMasterDetailListItemTag}>
        `);
        const { element: item, connect: connectItem, disconnect: disconnectItem } = itemFixture;

        try {
            await connectItem();
            await waitForUpdatesAsync();

            const itemContainer = item.shadowRoot?.querySelector<HTMLElement>('.item');

            expect(item.compact).toBeTrue();
            expect(itemContainer).toBeTruthy();
            expect(getComputedStyle(itemContainer!).paddingTop).toBe('10px');
            expect(getComputedStyle(itemContainer!).paddingBottom).toBe('10px');
        } finally {
            await disconnectItem?.();
        }
    });

    it('keeps arrow-key navigation working after an item click', async () => {
        ({ element, connect, disconnect } = await setup());
        await connect();
        await waitForUpdatesAsync();

        const input = getRequiredElement<HTMLInputElement>('.filter-input');
        const dmmItem = getItemByTitle('NI-DMM-004');
        dmmItem.dispatchEvent(new MouseEvent('click', { bubbles: true, composed: true }));
        await waitForUpdatesAsync();

        expect(dmmItem.selected).toBeTrue();

        input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true, cancelable: true }));
        await waitForUpdatesAsync();

        expect(getItemByTitle('NI-SWITCH-005').selected).toBeTrue();
    });

    it('supports custom status slot content', async () => {
        const itemFixture = await fixture<FvMasterDetailListItem>(html`
            <${fvMasterDetailListItemTag} title-text="NI-FGEN-003" subtitle="PXI-5421 · Storage">
                <span slot="status">!</span>
            </${fvMasterDetailListItemTag}>
        `);
        const { element: item, connect: connectItem, disconnect: disconnectItem } = itemFixture;

        try {
            await connectItem();
            await waitForUpdatesAsync();

            const statusSlot = item.shadowRoot?.querySelector<HTMLSlotElement>('slot[name="status"]');
            expect(statusSlot?.assignedElements({ flatten: true }).length).toBe(1);
        } finally {
            await disconnectItem?.();
        }
    });

    it('filters items in place using title and subtitle text', async () => {
        ({ element, connect, disconnect } = await setup());
        await connect();

        const input = getRequiredElement<HTMLInputElement>('.filter-input');
        input.value = 'lab c';
        input.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
        await waitForUpdatesAsync();

        expect(getItemByTitle('NI-SERIAL-006').hidden).toBeFalse();
        expect(getItemByTitle('NI-DAQ-001').hidden).toBeTrue();
        expect(getItemByTitle('NI-SERIAL-006').selected).toBeTrue();
    });

    it('moves selection up and down with arrow keys across visible items', async () => {
        ({ element, connect, disconnect } = await setup());
        await connect();

        const input = getRequiredElement<HTMLInputElement>('.filter-input');
        input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true, cancelable: true }));
        await waitForUpdatesAsync();

        expect(getItemByTitle('NI-SCOPE-002').selected).toBeTrue();

        input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true, cancelable: true }));
        await waitForUpdatesAsync();

        expect(getItemByTitle('NI-DAQ-001').selected).toBeTrue();
    });

    it('emits a change event when selection changes by click', async () => {
        ({ element, connect, disconnect } = await setup());
        let changeDetail:
            | {
                item: FvMasterDetailListItem | null,
                value: string | null
            }
            | undefined;
        element.addEventListener('change', event => {
            changeDetail = (event as CustomEvent<typeof changeDetail>).detail;
        });
        await connect();
        await waitForUpdatesAsync();

        const dmmItem = getItemByTitle('NI-DMM-004');
        dmmItem.dispatchEvent(new MouseEvent('click', { bubbles: true, composed: true }));
        await waitForUpdatesAsync();

        expect(dmmItem.selected).toBeTrue();
        expect(changeDetail?.item).toBe(dmmItem);
        expect(changeDetail?.value).toBe('dmm-004');
    });

    it('falls back to the title text when a selected item has no explicit value', async () => {
        const listFixture = await fixture<FvMasterDetailList>(html`
            <${fvMasterDetailListTag} placeholder="Filter devices...">
                <${fvMasterDetailListItemTag}
                    title-text="NI-DAQ-001"
                    subtitle="USB-6001 · Lab A"
                    value="daq-001"
                ></${fvMasterDetailListItemTag}>
                <${fvMasterDetailListItemTag}
                    title-text="NI-FGEN-003"
                    subtitle="PXI-5421 · Storage"
                ></${fvMasterDetailListItemTag}>
            </${fvMasterDetailListTag}>
        `);
        const { element: list, connect: connectList, disconnect: disconnectList } = listFixture;

        try {
            let changeDetail:
                | {
                    item: FvMasterDetailListItem | null,
                    value: string | null
                }
                | undefined;
            list.addEventListener('change', event => {
                changeDetail = (event as CustomEvent<typeof changeDetail>).detail;
            });
            await connectList();
            await waitForUpdatesAsync();

            const generatedItem = Array.from(list.querySelectorAll<FvMasterDetailListItem>(fvMasterDetailListItemTag)).find(
                item => item.titleText === 'NI-FGEN-003'
            );

            if (!generatedItem) {
                throw new Error('Expected generated item to exist');
            }

            generatedItem.dispatchEvent(new MouseEvent('click', { bubbles: true, composed: true }));
            await waitForUpdatesAsync();

            expect(changeDetail?.item).toBe(generatedItem);
            expect(changeDetail?.value).toBe('NI-FGEN-003');
        } finally {
            await disconnectList?.();
        }
    });
});