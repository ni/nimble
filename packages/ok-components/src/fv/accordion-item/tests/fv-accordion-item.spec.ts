import { html } from '@ni/fast-element';
import { waitForUpdatesAsync } from '@ni/nimble-components/dist/esm/testing/async-helpers';
import { FvAccordionItem, fvAccordionItemTag } from '..';
import { FvAccordionItemPageObject } from '../testing/fv-accordion-item.pageobject';
import { FvAccordionItemAppearance } from '../types';
import { fixture, type Fixture } from '../../../utilities/tests/fixture';

async function setup(
    expanded = false
): Promise<Fixture<FvAccordionItem>> {
    return await fixture<FvAccordionItem>(
        html`<${fvAccordionItemTag}
            header="Test Header"
            ?expanded="${() => expanded}"
        >
            <span>Test content</span>
        </${fvAccordionItemTag}>`
    );
}

describe('FvAccordionItem', () => {
    let element: FvAccordionItem;
    let connect: () => Promise<void>;
    let disconnect: (() => Promise<void>) | undefined;

    afterEach(async () => {
        await disconnect?.();
        disconnect = undefined;
    });

    it('can construct an element instance', () => {
        expect(document.createElement(fvAccordionItemTag)).toBeInstanceOf(
            FvAccordionItem
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
        const pageObject = new FvAccordionItemPageObject(element);
        expect(pageObject.getHeaderText()).toBe('Test Header');
    });

    it('should be collapsed by default', async () => {
        ({ element, connect, disconnect } = await setup(false));
        await connect();
        const pageObject = new FvAccordionItemPageObject(element);
        expect(pageObject.isExpanded()).toBeFalse();
    });

    it('should be expanded when expanded attribute is set', async () => {
        ({ element, connect, disconnect } = await setup(true));
        await connect();
        const pageObject = new FvAccordionItemPageObject(element);
        expect(pageObject.isExpanded()).toBeTrue();
    });

    it('should have a slot for content', async () => {
        ({ element, connect, disconnect } = await setup());
        await connect();
        const pageObject = new FvAccordionItemPageObject(element);
        expect(pageObject.hasContentSlot()).toBeTrue();
    });

    it('should have an expander icon', async () => {
        ({ element, connect, disconnect } = await setup());
        await connect();
        const pageObject = new FvAccordionItemPageObject(element);
        expect(pageObject.hasExpanderIcon()).toBeTrue();
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

    it('should update expanded when the details element toggles', async () => {
        ({ element, connect, disconnect } = await setup(false));
        await connect();
        const pageObject = new FvAccordionItemPageObject(element);
        await pageObject.clickSummary();

        expect(element.expanded).toBeTrue();
    });

    it('should default to ghost appearance', async () => {
        ({ element, connect, disconnect } = await setup());
        await connect();
        expect(element.appearance).toBe(FvAccordionItemAppearance.ghost);
    });

    it('should reflect appearance attribute', async () => {
        ({ element, connect, disconnect } = await setup());
        await connect();
        element.appearance = FvAccordionItemAppearance.ghost;
        await waitForUpdatesAsync();
        expect(element.getAttribute('appearance')).toBe('ghost');
    });

    it('should support block appearance', async () => {
        ({ element, connect, disconnect } = await setup());
        await connect();
        element.appearance = FvAccordionItemAppearance.block;
        await waitForUpdatesAsync();
        expect(element.getAttribute('appearance')).toBe('block');
    });
});
