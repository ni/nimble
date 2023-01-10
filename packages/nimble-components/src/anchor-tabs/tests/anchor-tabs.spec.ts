import { DOM, html } from '@microsoft/fast-element';
import { AnchorTabs } from '..';
import { fixture, Fixture } from '../../utilities/tests/fixture';

async function setup(): Promise<Fixture<AnchorTabs>> {
    return fixture<AnchorTabs>(
        html`
            <nimble-anchor-tabs activeid="tab-2">
                <nimble-anchor-tab id="tab-1"></nimble-anchor-tab>
                <nimble-anchor-tab id="tab-2"></nimble-anchor-tab>
                <nimble-anchor-tab id="tab-3"></nimble-anchor-tab>
            </nimble-anchor-tabs>`
    );
}

describe('AnchorTabs', () => {
    let element: AnchorTabs;
    let connect: () => Promise<void>;
    let disconnect: () => Promise<void>;

    beforeEach(async () => {
        ({ element, connect, disconnect } = await setup());
    });

    afterEach(async () => {
        await disconnect();
    });

    it('can construct an element instance', () => {
        expect(document.createElement('nimble-anchor-tabs')).toBeInstanceOf(
            AnchorTabs
        );
    });

    it('should set the "tablist" class on the internal div', async () => {
        await connect();
        expect(element.tablist!.classList.contains('tablist')).toBe(true);
    });

    it('should set the `part` attribute to "tablist" on the internal div', async () => {
        await connect();
        expect(element.tablist!.part.contains('tablist')).toBe(true);
    });

    it('should set the `role` attribute to "tablist" on the internal div', async () => {
        await connect();
        expect(element.tablist!.getAttribute('role')).toBe('tablist');
    });

    it('should have a slots named "start", "anchortab", and "end", in that order', async () => {
        await connect();
        const slots = element.shadowRoot?.querySelectorAll('slot');
        expect(slots![0]?.getAttribute('name')).toBe('start');
        expect(slots![1]?.getAttribute('name')).toBe('anchortab');
        expect(slots![2]?.getAttribute('name')).toBe('end');
    });

    it('should set activeid property from attribute value', async () => {
        await connect();
        expect(element.activeid).toBe('tab-2');
    });

    it('should populate tabs array with anchor tabs', async () => {
        await connect();
        DOM.processUpdates();
        expect(element.tabs.length).toBe(3);
        expect(element.tabs[0]?.nodeName).toBe('nimble-anchor-tab');
        expect(element.tabs[1]?.nodeName).toBe('nimble-anchor-tab');
        expect(element.tabs[2]?.nodeName).toBe('nimble-anchor-tab');
    });

    it('should set activetab property', async () => {
        await connect();
        expect(element.activetab).toBeDefined();
        expect(element.activetab!.id).toBe('tab-2');
    });
});
