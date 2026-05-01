import { html, type ViewTemplate } from '@ni/fast-element';
import { waitForUpdatesAsync } from '@ni/nimble-components/dist/esm/testing/async-helpers';
import { cardTag } from '@ni/nimble-components/dist/esm/card';
import { cardButtonTag } from '@ni/nimble-components/dist/esm/card-button';
import { FvCard, fvCardTag } from '..';
import { FvCardAppearance, FvCardInteractionMode } from '../types';
import { fixture, type Fixture } from '../../../utilities/tests/fixture';

async function setup(
    markup: ViewTemplate = html`<${fvCardTag} card-title="Plugin Manager"></${fvCardTag}>`
): Promise<Fixture<FvCard>> {
    return await fixture<FvCard>(
        markup
    );
}

describe('FvCard', () => {
    let element: FvCard;
    let connect: () => Promise<void>;
    let disconnect: (() => Promise<void>) | undefined;

    afterEach(async () => {
        await disconnect?.();
        disconnect = undefined;
    });

    it('can construct an element instance', () => {
        expect(document.createElement(fvCardTag)).toBeInstanceOf(FvCard);
    });

    it('defaults to static interaction mode', async () => {
        ({ element, connect, disconnect } = await setup());
        await connect();

        expect(element.interactionMode).toBe(FvCardInteractionMode.static);
        expect(element.appearance).toBe(FvCardAppearance.outline);
        expect(element.shadowRoot?.querySelector(cardTag)).not.toBeNull();
        expect(element.shadowRoot?.querySelector(cardButtonTag)).toBeNull();
    });

    it('reflects the outline appearance attribute', async () => {
        ({ element, connect, disconnect } = await setup(
            html`<${fvCardTag}
                card-title="Plugin Manager"
                appearance="outline"
            ></${fvCardTag}>`
        ));
        await connect();

        expect(element.getAttribute('appearance')).toBe('outline');
    });

    it('supports the block appearance', async () => {
        ({ element, connect, disconnect } = await setup(
            html`<${fvCardTag}
                card-title="Plugin Manager"
                appearance="block"
            ></${fvCardTag}>`
        ));
        await connect();

        expect(element.appearance).toBe(FvCardAppearance.block);
        expect(element.getAttribute('appearance')).toBe('block');
    });

    it('renders a card button shell in card interaction mode', async () => {
        ({ element, connect, disconnect } = await setup(
            html`<${fvCardTag}
                card-title="Plugin Manager"
                interaction-mode="card"
            ></${fvCardTag}>`
        ));
        await connect();

        expect(element.shadowRoot?.querySelector(cardButtonTag)).not.toBeNull();
        expect(element.shadowRoot?.querySelector(cardTag)).toBeNull();
    });

    it('renders title, subtitle, and description content', async () => {
        ({ element, connect, disconnect } = await setup(
            html`<${fvCardTag}
                card-title="Plugin Manager"
                subtitle="NI Plugin Manager"
                description="Install curated plugins."
            ></${fvCardTag}>`
        ));
        await connect();

        expect(element.shadowRoot?.querySelector('.title')?.textContent?.trim()).toBe('Plugin Manager');
        expect(element.shadowRoot?.querySelector('.subtitle')?.textContent?.trim()).toBe('NI Plugin Manager');
        expect(element.shadowRoot?.querySelector('.description')?.textContent?.trim()).toBe('Install curated plugins.');
    });

    it('renders initials when no icon slot content is present', async () => {
        ({ element, connect, disconnect } = await setup(
            html`<${fvCardTag}
                card-title="Feed Configuration"
                initials="fc"
            ></${fvCardTag}>`
        ));
        await connect();

        expect(element.shadowRoot?.querySelector('.initials-tile')?.textContent?.trim()).toBe('FC');
    });

    it('suppresses initials when icon slot content is assigned', async () => {
        ({ element, connect, disconnect } = await setup(
            html`<${fvCardTag}
                card-title="Feed Configuration"
                initials="fc"
            >
                <span slot="icon">Icon</span>
            </${fvCardTag}>`
        ));
        await connect();
        await waitForUpdatesAsync();

        expect(element.hasIconContent).toBeTrue();
        expect(element.shadowRoot?.querySelector('.initials-tile')).toBeNull();
    });

    it('renders footer slots when assigned', async () => {
        ({ element, connect, disconnect } = await setup(
            html`<${fvCardTag} card-title="Plugin Manager">
                <span slot="footer-start">Administration</span>
                <span slot="footer-end">v1.1.1</span>
            </${fvCardTag}>`
        ));
        await connect();
        await waitForUpdatesAsync();

        const footer = element.shadowRoot?.querySelector('.footer');
        expect(footer).not.toBeNull();
    });

    it('renders actions slot content in static mode', async () => {
        ({ element, connect, disconnect } = await setup(
            html`<${fvCardTag} card-title="Plugin Manager">
                <button slot="actions" type="button">Install</button>
            </${fvCardTag}>`
        ));
        await connect();
        await waitForUpdatesAsync();

        const actionsSlot = element.shadowRoot?.querySelector<HTMLSlotElement>('slot[name="actions"]');
        expect(actionsSlot?.assignedElements({ flatten: true }).length).toBe(1);
        expect(element.shadowRoot?.querySelector('.actions')).not.toBeNull();
    });

    it('does not render the actions row in card interaction mode', async () => {
        ({ element, connect, disconnect } = await setup(
            html`<${fvCardTag}
                card-title="Plugin Manager"
                interaction-mode="card"
            >
                <button slot="actions" type="button">Install</button>
            </${fvCardTag}>`
        ));
        await connect();
        await waitForUpdatesAsync();

        expect(element.hasActionsContent).toBeTrue();
        expect(element.shadowRoot?.querySelector('.actions')).toBeNull();
    });

    it('forwards disabled to the interactive shell', async () => {
        ({ element, connect, disconnect } = await setup(
            html`<${fvCardTag}
                card-title="Plugin Manager"
                interaction-mode="card"
                disabled
            ></${fvCardTag}>`
        ));
        await connect();

        const cardButton = element.shadowRoot?.querySelector(cardButtonTag);
        expect(cardButton?.hasAttribute('disabled')).toBeTrue();
    });

    it('stores the heading on card-title instead of the native title attribute', async () => {
        ({ element, connect, disconnect } = await setup());
        await connect();

        expect(element.getAttribute('card-title')).toBe('Plugin Manager');
        expect(element.getAttribute('title')).toBeNull();
        expect(element.shadowRoot?.querySelector('.title')?.textContent?.trim()).toBe('Plugin Manager');
    });
});
