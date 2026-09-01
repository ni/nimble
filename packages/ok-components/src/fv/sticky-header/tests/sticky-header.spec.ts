import { html } from '@ni/fast-element';
import { waitForUpdatesAsync } from '@ni/nimble-components/dist/esm/testing/async-helpers';
import { waitAnimationFrame } from '@ni/nimble-components/dist/esm/utilities/testing/component';
import { fixture, type Fixture } from '../../../utilities/tests/fixture';
import { FvStickyHeader, fvStickyHeaderTag } from '..';

async function setup(): Promise<Fixture<FvStickyHeader>> {
    return await fixture<FvStickyHeader>(html`
        <${fvStickyHeaderTag}>
            <header slot="header">Primary header</header>
            <div slot="sticky-header">Sticky header</div>
        </${fvStickyHeaderTag}>
    `);
}

describe('FvStickyHeader', () => {
    let element: FvStickyHeader;
    let connect: () => Promise<void>;
    let disconnect: (() => Promise<void>) | undefined;

    afterEach(async () => {
        await disconnect?.();
        disconnect = undefined;
    });

    it('can construct an element instance', () => {
        expect(document.createElement(fvStickyHeaderTag)).toBeInstanceOf(FvStickyHeader);
    });

    it('projects both header slots', async () => {
        ({ element, connect, disconnect } = await setup());
        await connect();
        await waitForUpdatesAsync();

        expect(element.querySelector('[slot="header"]')?.textContent).toBe('Primary header');
        expect(element.querySelector('[slot="sticky-header"]')?.textContent).toBe('Sticky header');
    });

    it('hides the sticky header while the primary header is visible', async () => {
        ({ element, connect, disconnect } = await setup());
        await connect();
        await waitForUpdatesAsync();

        expect(element.shadowRoot?.querySelector('.sticky-header')?.hasAttribute('hidden')).toBeTrue();
    });

    it('keeps the sticky header hidden when the primary header is below the viewport', async () => {
        ({ element, connect, disconnect } = await setup());
        await connect();
        await waitForUpdatesAsync();

        const header = element.querySelector<HTMLElement>('[slot="header"]')!;
        element.handleHeaderIntersection([{
            target: header,
            isIntersecting: false,
            boundingClientRect: { top: window.innerHeight + 100 }
        } as unknown as IntersectionObserverEntry]);
        await waitForUpdatesAsync();

        expect(element.shadowRoot?.querySelector('.sticky-header')?.hasAttribute('hidden')).toBeTrue();
    });

    it('shows the sticky header after the primary header leaves the viewport', async () => {
        ({ element, connect, disconnect } = await setup());
        await connect();
        await waitForUpdatesAsync();

        const header = element.querySelector<HTMLElement>('[slot="header"]')!;
        header.style.transform = 'translateY(-100px)';
        await waitAnimationFrame();
        await waitForUpdatesAsync();

        expect(element.shadowRoot?.querySelector('.sticky-header')?.hasAttribute('hidden')).toBeFalse();
    });

    it('hides the sticky header when the primary header returns to the viewport', async () => {
        ({ element, connect, disconnect } = await setup());
        await connect();
        await waitForUpdatesAsync();

        const header = element.querySelector<HTMLElement>('[slot="header"]')!;
        header.style.transform = 'translateY(-100px)';
        await waitAnimationFrame();
        await waitForUpdatesAsync();
        header.style.transform = '';
        await waitAnimationFrame();
        await waitForUpdatesAsync();

        expect(element.shadowRoot?.querySelector('.sticky-header')?.hasAttribute('hidden')).toBeTrue();
    });
});
