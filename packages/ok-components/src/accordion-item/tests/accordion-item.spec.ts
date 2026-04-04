import { html } from '@ni/fast-element';
import { waitForUpdatesAsync } from '@ni/nimble-components/dist/esm/testing/async-helpers';
import { AccordionItem, accordionItemTag } from '..';
import { AccordionItemAppearance } from '../types';
import { fixture, type Fixture } from '../../utilities/tests/fixture';

async function setup(
    expanded = false
): Promise<Fixture<AccordionItem>> {
    return await fixture<AccordionItem>(
        html`<${accordionItemTag}
            header="Test Header"
            ?expanded="${() => expanded}"
        >
            <span>Test content</span>
        </${accordionItemTag}>`
    );
}

describe('AccordionItem', () => {
    let element: AccordionItem;
    let connect: () => Promise<void>;
    let disconnect: (() => Promise<void>) | undefined;

    afterEach(async () => {
        await disconnect?.();
        disconnect = undefined;
    });

    it('can construct an element instance', () => {
        expect(document.createElement(accordionItemTag)).toBeInstanceOf(
            AccordionItem
        );
    });

    it('should have a details element in the shadow DOM', async () => {
        ({ element, connect, disconnect } = await setup());
        await connect();
        const details = element.shadowRoot?.querySelector('details');
        expect(details).not.toBeNull();
    });

    it('should display the header text', async () => {
        ({ element, connect, disconnect } = await setup());
        await connect();
        const titleSpan = element.shadowRoot?.querySelector(
            '.accordion-item-title'
        );
        expect(titleSpan?.textContent?.trim()).toBe('Test Header');
    });

    it('should be collapsed by default', async () => {
        ({ element, connect, disconnect } = await setup(false));
        await connect();
        const details = element.shadowRoot?.querySelector('details');
        expect(details?.open).toBeFalse();
    });

    it('should be expanded when expanded attribute is set', async () => {
        ({ element, connect, disconnect } = await setup(true));
        await connect();
        const details = element.shadowRoot?.querySelector('details');
        expect(details?.open).toBeTrue();
    });

    it('should have a slot for content', async () => {
        ({ element, connect, disconnect } = await setup());
        await connect();
        const slot = element.shadowRoot?.querySelector('slot');
        expect(slot).not.toBeNull();
    });

    it('should have an expander icon', async () => {
        ({ element, connect, disconnect } = await setup());
        await connect();
        const icon = element.shadowRoot?.querySelector(
            'nimble-icon-arrow-expander-right'
        );
        expect(icon).not.toBeNull();
    });

    it('should update header when property changes', async () => {
        ({ element, connect, disconnect } = await setup());
        await connect();
        element.header = 'New Header';
        await waitForUpdatesAsync();
        const titleSpan = element.shadowRoot?.querySelector(
            '.accordion-item-title'
        );
        expect(titleSpan?.textContent?.trim()).toBe('New Header');
    });

    it('should default to outline appearance', async () => {
        ({ element, connect, disconnect } = await setup());
        await connect();
        expect(element.appearance).toBe(AccordionItemAppearance.outline);
    });

    it('should reflect appearance attribute', async () => {
        ({ element, connect, disconnect } = await setup());
        await connect();
        element.appearance = AccordionItemAppearance.ghost;
        await waitForUpdatesAsync();
        expect(element.getAttribute('appearance')).toBe('ghost');
    });

    it('should support block appearance', async () => {
        ({ element, connect, disconnect } = await setup());
        await connect();
        element.appearance = AccordionItemAppearance.block;
        await waitForUpdatesAsync();
        expect(element.getAttribute('appearance')).toBe('block');
    });
});
