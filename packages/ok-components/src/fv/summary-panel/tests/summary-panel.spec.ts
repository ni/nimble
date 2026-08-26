import { html } from '@ni/fast-element';
import { waitForUpdatesAsync } from '@ni/nimble-components/dist/esm/testing/async-helpers';
import { waitAnimationFrame } from '@ni/nimble-components/dist/esm/utilities/testing/component';
import { fixture, type Fixture } from '../../../utilities/tests/fixture';
import { FvSummaryPanel, fvSummaryPanelTag } from '..';
import { FvSummaryPanelSize } from '../types';
import { fvSummaryPanelTileTag } from '../../summary-panel-tile';

async function setup(): Promise<Fixture<FvSummaryPanel>> {
    return await fixture<FvSummaryPanel>(html`
        <${fvSummaryPanelTag}>
            <div>852 FILES</div>
            <div>1234 TEST RESULTS</div>
        </${fvSummaryPanelTag}>
    `);
}

async function setupWithTiles(): Promise<Fixture<FvSummaryPanel>> {
    return await fixture<FvSummaryPanel>(html`
        <${fvSummaryPanelTag}>
            <${fvSummaryPanelTileTag} count="852" label="files"></${fvSummaryPanelTileTag}>
            <${fvSummaryPanelTileTag} count="1234" label="test results"></${fvSummaryPanelTileTag}>
            <${fvSummaryPanelTileTag} count="42" label="systems"></${fvSummaryPanelTileTag}>
            <${fvSummaryPanelTileTag} count="17" label="assets"></${fvSummaryPanelTileTag}>
            <${fvSummaryPanelTileTag} count="8" label="alarms"></${fvSummaryPanelTileTag}>
            <${fvSummaryPanelTileTag} count="3" label="users"></${fvSummaryPanelTileTag}>
        </${fvSummaryPanelTag}>
    `);
}

describe('FvSummaryPanel', () => {
    let element: FvSummaryPanel;
    let connect: () => Promise<void>;
    let disconnect: (() => Promise<void>) | undefined;

    afterEach(async () => {
        await disconnect?.();
        disconnect = undefined;
    });

    it('can construct an element instance', () => {
        expect(document.createElement(fvSummaryPanelTag)).toBeInstanceOf(FvSummaryPanel);
    });

    it('does not render the edit-items button by default', async () => {
        ({ element, connect, disconnect } = await setup());
        await connect();

        expect(element.shadowRoot?.querySelector('.edit-items-button')).toBeNull();
    });

    it('renders the edit-items button when enabled', async () => {
        ({ element, connect, disconnect } = await setup());
        element.showEditItemsButton = true;
        await connect();
        await waitForUpdatesAsync();

        expect(element.shadowRoot?.querySelector('.edit-items-button')?.getAttribute('title')).toBe('Configure');
    });

    it('emits edit-items when the built-in button is clicked', async () => {
        ({ element, connect, disconnect } = await setup());
        const editItemsSpy = jasmine.createSpy('edit-items');
        element.showEditItemsButton = true;
        element.addEventListener('edit-items', editItemsSpy);
        await connect();
        await waitForUpdatesAsync();

        (element.shadowRoot?.querySelector('.edit-items-button') as HTMLElement | null)?.click();

        expect(editItemsSpy).toHaveBeenCalled();
    });

    it('propagates legacy styling to slotted summary panel tiles', async () => {
        ({ element, connect, disconnect } = await setupWithTiles());
        element.legacyStyle = true;
        await connect();
        await waitForUpdatesAsync();

        const tile = element.querySelector(fvSummaryPanelTileTag);
        expect(tile?.hasAttribute('legacy-style')).toBeTrue();

        element.legacyStyle = false;
        await waitForUpdatesAsync();

        expect(tile?.hasAttribute('legacy-style')).toBeFalse();
    });

    it('propagates compact sizing to slotted summary panel tiles', async () => {
        ({ element, connect, disconnect } = await setupWithTiles());
        element.size = FvSummaryPanelSize.compact;
        await connect();
        await waitForUpdatesAsync();

        const tile = element.querySelector(fvSummaryPanelTileTag);
        expect(tile?.getAttribute('size')).toBe(FvSummaryPanelSize.compact);

        element.size = FvSummaryPanelSize.default;
        await waitForUpdatesAsync();

        expect(tile?.hasAttribute('size')).toBeFalse();
    });

    it('only applies the compact overflow fade when items overflow', async () => {
        ({ element, connect, disconnect } = await setupWithTiles());
        element.style.width = '1000px';
        element.size = FvSummaryPanelSize.compact;
        await connect();
        await waitForUpdatesAsync();
        await waitAnimationFrame();

        const container = element.shadowRoot?.querySelector('.summary-item-container');
        expect(container?.classList.contains('has-overflow')).toBeFalse();

        await disconnect?.();
        ({ element, connect, disconnect } = await setupWithTiles());
        element.style.width = '200px';
        element.size = FvSummaryPanelSize.compact;
        await connect();
        await waitForUpdatesAsync();
        await waitAnimationFrame();

        const overflowingContainer = element.shadowRoot?.querySelector('.summary-item-container');
        expect(overflowingContainer?.classList.contains('has-overflow')).toBeTrue();
        expect(overflowingContainer?.scrollWidth).toBeGreaterThan(overflowingContainer?.clientWidth ?? 0);
        expect(getComputedStyle(overflowingContainer!).overflowX).toBe('auto');
    });
});