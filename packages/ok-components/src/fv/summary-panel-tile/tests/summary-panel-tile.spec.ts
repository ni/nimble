import { html } from '@ni/fast-element';
import { fixture, type Fixture } from '../../../utilities/tests/fixture';
import { FvSummaryPanelTile, fvSummaryPanelTileTag } from '..';

async function setup(): Promise<Fixture<FvSummaryPanelTile>> {
    return await fixture<FvSummaryPanelTile>(html`
        <${fvSummaryPanelTileTag}
            count="234"
            label="systems"
        ></${fvSummaryPanelTileTag}>
    `);
}

describe('FvSummaryPanelTile', () => {
    let element: FvSummaryPanelTile;
    let connect: () => Promise<void>;
    let disconnect: (() => Promise<void>) | undefined;

    afterEach(async () => {
        await disconnect?.();
        disconnect = undefined;
    });

    it('can construct an element instance', () => {
        expect(document.createElement(fvSummaryPanelTileTag)).toBeInstanceOf(FvSummaryPanelTile);
    });

    it('renders the count and label', async () => {
        ({ element, connect, disconnect } = await setup());
        await connect();

        expect(element.shadowRoot?.querySelector('.count')?.textContent?.trim()).toBe('234');
        expect(element.shadowRoot?.querySelector('.label')?.textContent?.trim()).toBe('systems');
    });

    it('does not set an aria-label on the internal card button', async () => {
        ({ element, connect, disconnect } = await setup());
        await connect();

        expect(element.shadowRoot?.querySelector('nimble-card-button')?.hasAttribute('aria-label')).toBeFalse();
    });

    it('defaults to beside text positioning', async () => {
        ({ element, connect, disconnect } = await setup());
        await connect();

        expect(element.shadowRoot?.querySelector('.summary-panel-tile-content')?.classList.contains('beside')).toBeTrue();
    });

    it('supports under text positioning', async () => {
        ({ element, connect, disconnect } = await setup());
        element.textPosition = 'under';
        await connect();

        expect(element.shadowRoot?.querySelector('.summary-panel-tile-content')?.classList.contains('under')).toBeTrue();
    });

    it('supports the legacy-style attribute', async () => {
        ({ element, connect, disconnect } = await setup());
        element.legacyStyle = true;
        await connect();

        expect(element.hasAttribute('legacy-style')).toBeTrue();
    });
});