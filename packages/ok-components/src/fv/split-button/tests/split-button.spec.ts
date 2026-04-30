import { html } from '@ni/fast-element';
import { menuTag } from '@ni/nimble-components/dist/esm/menu';
import { waitForUpdatesAsync } from '@ni/nimble-components/dist/esm/testing/async-helpers';
import { fixture, type Fixture } from '../../../utilities/tests/fixture';
import { FvSplitButton, fvSplitButtonTag } from '..';

async function setup(): Promise<Fixture<FvSplitButton>> {
    return await fixture<FvSplitButton>(html`
        <${fvSplitButtonTag} label="Primary function"></${fvSplitButtonTag}>
    `);
}

describe('FvSplitButton', () => {
    let element: FvSplitButton;
    let connect: () => Promise<void>;
    let disconnect: (() => Promise<void>) | undefined;

    afterEach(async () => {
        await disconnect?.();
        disconnect = undefined;
    });

    it('can construct an element instance', () => {
        expect(document.createElement(fvSplitButtonTag)).toBeInstanceOf(FvSplitButton);
    });

    it('opens when the toggle button is clicked', async () => {
        ({ element, connect, disconnect } = await setup());
        await connect();

        (element.shadowRoot?.querySelector('.split-button-toggle') as HTMLButtonElement | null)!.click();
        await waitForUpdatesAsync();

        expect(element.open).toBeTrue();
    });

    it('disables the internal buttons when disabled is true', async () => {
        ({ element, connect, disconnect } = await setup());
        element.disabled = true;
        await connect();
        await waitForUpdatesAsync();

        const buttons = Array.from(
            element.shadowRoot?.querySelectorAll<HTMLButtonElement>('button') ?? []
        );

        expect(buttons.length).toBe(2);
        expect(buttons.every(button => button.disabled)).toBeTrue();
    });

    it('does not open or emit toggle when disabled', async () => {
        ({ element, connect, disconnect } = await setup());
        const toggleSpy = jasmine.createSpy('toggle');
        element.disabled = true;
        element.addEventListener('toggle', toggleSpy);
        await connect();

        (element.shadowRoot?.querySelector('.split-button-toggle') as HTMLButtonElement | null)!.click();
        await waitForUpdatesAsync();

        expect(element.open).toBeFalse();
        expect(toggleSpy).not.toHaveBeenCalled();
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

    it('closes when the slotted nimble-menu emits change', async () => {
        ({ element, connect, disconnect } = await fixture<FvSplitButton>(html`
            <${fvSplitButtonTag} label="Primary function">
                <${menuTag} slot="menu"></${menuTag}>
            </${fvSplitButtonTag}>
        `));
        await connect();

        element.open = true;
        await waitForUpdatesAsync();

        element.querySelector(menuTag)?.dispatchEvent(new Event('change', { bubbles: true }));
        await waitForUpdatesAsync();

        expect(element.open).toBeFalse();
    });
});