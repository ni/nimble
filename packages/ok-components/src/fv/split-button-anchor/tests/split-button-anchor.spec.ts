import { html } from '@ni/fast-element';
import { parameterizeSpec } from '@ni/jasmine-parameterized';
import { menuTag } from '@ni/nimble-components/dist/esm/menu';
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
        expect(element.region?.anchorElement).toBe(element.toggleButton);
    });

    parameterizeSpec([
        { name: 'disabled', disabled: true, href: 'https://example.com' },
        { name: 'missing href', disabled: false, href: '' }
    ], (spec, stateName, state) => {
        spec(`keeps icon slots in the primary surface across ${stateName} state changes`, async () => {
            ({ element, connect, disconnect } = await fixture<FvSplitButtonAnchor>(html`
                <${fvSplitButtonAnchorTag} label="Open" href="https://example.com">
                    <span slot="start">Start</span>
                    <span slot="end">End</span>
                </${fvSplitButtonAnchorTag}>
            `));
            await connect();

            const expectIconSlots = (tag: string): void => {
                const primary = element.shadowRoot!.querySelector('.split-button-primary')!;
                expect(primary.tagName).toBe(tag);
                for (const name of ['start', 'end']) {
                    const slot = primary.querySelector<HTMLSlotElement>(`slot[name="${name}"]`)!;
                    expect(slot.assignedElements()).toEqual([element.querySelector(`[slot="${name}"]`)!]);
                }
            };

            expectIconSlots('A');
            element.disabled = state.disabled;
            element.href = state.href;
            await waitForUpdatesAsync();
            expectIconSlots('SPAN');
            element.disabled = false;
            element.href = 'https://example.com';
            await waitForUpdatesAsync();
            expectIconSlots('A');
        });
    });

    it('emits trigger when the primary anchor is clicked', async () => {
        ({ element, connect, disconnect } = await setup());
        const triggerSpy = jasmine.createSpy('trigger');
        element.addEventListener('trigger', triggerSpy);
        await connect();

        const anchor = (element.shadowRoot?.querySelector('.split-button-primary') as HTMLAnchorElement | null)!;
        anchor.addEventListener('click', event => event.preventDefault());

        anchor.click();

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
    });

    it('closes when the slotted nimble-menu emits change', async () => {
        ({ element, connect, disconnect } = await fixture<FvSplitButtonAnchor>(html`
            <${fvSplitButtonAnchorTag}
                label="Primary function"
                href="https://example.com"
            >
                <${menuTag} slot="menu"></${menuTag}>
            </${fvSplitButtonAnchorTag}>
        `));
        await connect();

        element.open = true;
        await waitForUpdatesAsync();

        element.querySelector(menuTag)?.dispatchEvent(new Event('change', { bubbles: true }));
        await waitForUpdatesAsync();

        expect(element.open).toBeFalse();
    });

    it('closes when clicking outside the component', async () => {
        ({ element, connect, disconnect } = await setup());
        await connect();

        element.open = true;
        await waitForUpdatesAsync();

        document.body.click();
        await waitForUpdatesAsync();

        expect(element.open).toBeFalse();
    });

    it('closes when Escape is pressed', async () => {
        ({ element, connect, disconnect } = await setup());
        await connect();

        element.open = true;
        await waitForUpdatesAsync();

        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
        await waitForUpdatesAsync();

        expect(element.open).toBeFalse();
    });
});