import { html } from '@ni/fast-element';
import { waitForUpdatesAsync } from '@ni/nimble-components/dist/esm/testing/async-helpers';
import { fixture, type Fixture } from '../../../utilities/tests/fixture';
import { FvSplitButtonAnchor, fvSplitButtonAnchorTag } from '..';

async function setup(): Promise<Fixture<FvSplitButtonAnchor>> {
    return await fixture<FvSplitButtonAnchor>(html`
        <${fvSplitButtonAnchorTag}
            label="Primary function"
            href="https://example.com"
        ></${fvSplitButtonAnchorTag}>
    `);
}

describe('FvSplitButtonAnchor', () => {
    let element: FvSplitButtonAnchor;
    let connect: () => Promise<void>;
    let disconnect: (() => Promise<void>) | undefined;

    afterEach(async () => {
        await disconnect?.();
        disconnect = undefined;
    });

    it('can construct an element instance', () => {
        expect(document.createElement(fvSplitButtonAnchorTag)).toBeInstanceOf(FvSplitButtonAnchor);
    });

    it('renders an anchor-backed primary action', async () => {
        ({ element, connect, disconnect } = await setup());
        await connect();

        const anchor = element.shadowRoot?.querySelector<HTMLAnchorElement>('.split-button-primary');

        expect(anchor).not.toBeNull();
        expect(anchor?.getAttribute('href')).toBe('https://example.com');
    });

    it('opens when the toggle button is clicked', async () => {
        ({ element, connect, disconnect } = await setup());
        await connect();

        (element.shadowRoot?.querySelector('.split-button-toggle') as HTMLButtonElement | null)!.click();
        await waitForUpdatesAsync();

        expect(element.open).toBeTrue();
    });

    it('emits trigger when the primary anchor is clicked', async () => {
        ({ element, connect, disconnect } = await setup());
        const triggerSpy = jasmine.createSpy('trigger');
        element.addEventListener('trigger', triggerSpy);
        await connect();

        (element.shadowRoot?.querySelector('.split-button-primary') as HTMLAnchorElement | null)!.click();

        expect(triggerSpy).toHaveBeenCalled();
    });

    it('renders a disabled primary surface when disabled is true', async () => {
        ({ element, connect, disconnect } = await setup());
        element.disabled = true;
        await connect();
        await waitForUpdatesAsync();

        expect(element.shadowRoot?.querySelector('a.split-button-primary')).toBeNull();
        expect(element.shadowRoot?.querySelector('.split-button-primary-disabled')).not.toBeNull();
        expect((element.shadowRoot?.querySelector('.split-button-toggle') as HTMLButtonElement | null)?.disabled).toBeTrue();
    });

    it('closes when disabled while open', async () => {
        ({ element, connect, disconnect } = await setup());
        await connect();

        element.open = true;
        await waitForUpdatesAsync();
        element.disabled = true;
        await waitForUpdatesAsync();

        expect(element.open).toBeFalse();
        expect(element.shadowRoot?.querySelector('.split-button-menu')?.hasAttribute('hidden')).toBeTrue();
    });
});