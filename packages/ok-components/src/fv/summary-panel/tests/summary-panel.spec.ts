import { html } from '@ni/fast-element';
import { waitForUpdatesAsync } from '@ni/nimble-components/dist/esm/testing/async-helpers';
import { fixture, type Fixture } from '../../../utilities/tests/fixture';
import { FvSummaryPanel, fvSummaryPanelTag } from '..';
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
});