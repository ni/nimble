import { html } from '@ni/fast-element';
import { menuTag } from '@ni/nimble-components/dist/esm/menu';
import { menuItemTag } from '@ni/nimble-components/dist/esm/menu-item';
import { waitForUpdatesAsync } from '@ni/nimble-components/dist/esm/testing/async-helpers';
import { waitForEvent } from '@ni/nimble-components/dist/esm/utilities/testing/component';
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

    it('uses the label for multiline menu-only markup with whitespace in the default slot', async () => {
        ({ element, connect, disconnect } = await fixture<FvSplitButton>(html`
            <${fvSplitButtonTag} label="Run query">
                <${menuTag} slot="menu"></${menuTag}>
            </${fvSplitButtonTag}>
        `));
        await connect();
        await waitForUpdatesAsync();

        const primary = element.shadowRoot?.querySelector<HTMLButtonElement>('.split-button-primary');
        expect(primary?.innerText.trim()).toBe('Run query');
        element.label = 'Updated action';
        await waitForUpdatesAsync();
        expect(primary?.innerText.trim()).toBe('Updated action');
    });

    it('projects start and end icons into the primary button', async () => {
        ({ element, connect, disconnect } = await fixture<FvSplitButton>(html`
            <${fvSplitButtonTag} label="Run">
                <span slot="start">Start</span>
                <span slot="end">End</span>
            </${fvSplitButtonTag}>
        `));
        await connect();

        const primary = element.shadowRoot!.querySelector('.split-button-primary')!;
        for (const name of ['start', 'end']) {
            const slot = primary.querySelector<HTMLSlotElement>(`slot[name="${name}"]`)!;
            expect(slot.assignedElements()).toEqual([element.querySelector(`[slot="${name}"]`)!]);
        }
    });

    it('opens its menu in the top layer and closes on Escape', async () => {
        ({ element, connect, disconnect } = await setup());
        await connect();

        (element.shadowRoot?.querySelector('.split-button-toggle') as HTMLButtonElement | null)!.click();
        await waitForUpdatesAsync();

        expect(element.open).toBeTrue();
        const region = element.region;
        expect(region?.isConnected).toBeTrue();
        expect(region?.matches(':popover-open')).toBeTrue();

        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
        await waitForUpdatesAsync();

        expect(element.open).toBeFalse();
        expect(region?.matches(':popover-open')).toBeFalse();
    });

    it('moves focus into the menu when opened and supports keyboard navigation', async () => {
        ({ element, connect, disconnect } = await fixture<FvSplitButton>(html`
            <${fvSplitButtonTag} label="Apply">
                <${menuTag} slot="menu">
                    <${menuItemTag}>First</${menuItemTag}>
                    <${menuItemTag}>Second</${menuItemTag}>
                </${menuTag}>
            </${fvSplitButtonTag}>
        `));
        await connect();
        const toggle = element.shadowRoot!.querySelector<HTMLButtonElement>('.split-button-toggle')!;
        const items = element.querySelectorAll<HTMLElement>(menuItemTag);

        toggle.focus();
        toggle.dispatchEvent(new KeyboardEvent('keydown', {
            key: 'ArrowDown', bubbles: true, composed: true, cancelable: true
        }));
        await waitForUpdatesAsync();
        if (!element.region!.initialLayoutComplete) {
            await waitForEvent(element.region!, 'loaded');
        }
        expect(element.open).toBeTrue();
        expect(document.activeElement).toBe(items[0]!);

        items[0]!.dispatchEvent(new KeyboardEvent('keydown', {
            key: 'ArrowDown', bubbles: true, composed: true, cancelable: true
        }));
        expect(document.activeElement).toBe(items[1]!);
        items[1]!.dispatchEvent(new KeyboardEvent('keydown', {
            key: 'Escape', bubbles: true, composed: true, cancelable: true
        }));
        await waitForUpdatesAsync();
        expect(element.open).toBeFalse();
        expect(element.shadowRoot?.activeElement).toBe(toggle);

        toggle.click();
        await waitForUpdatesAsync();
        if (!element.region!.initialLayoutComplete) {
            await waitForEvent(element.region!, 'loaded');
        }
        expect(document.activeElement).toBe(items[0]!);
    });

    it('restores focus after selecting a menu item without overriding the action destination', async () => {
        ({ element, connect, disconnect } = await fixture<FvSplitButton>(html`
            <${fvSplitButtonTag} label="Apply">
                <${menuTag} slot="menu">
                    <${menuItemTag}>First</${menuItemTag}>
                </${menuTag}>
            </${fvSplitButtonTag}>
        `));
        await connect();
        const toggle = element.shadowRoot!.querySelector<HTMLButtonElement>('.split-button-toggle')!;
        const menu = element.querySelector<HTMLElement>(menuTag)!;
        const item = menu.querySelector<HTMLElement>(menuItemTag)!;
        const destination = document.createElement('button');
        element.parentElement!.append(destination);

        toggle.click();
        await waitForUpdatesAsync();
        if (!element.region!.initialLayoutComplete) {
            await waitForEvent(element.region!, 'loaded');
        }
        expect(document.activeElement).toBe(item);
        item.click();
        await waitForUpdatesAsync();
        expect(element.open).toBeFalse();
        expect(element.shadowRoot?.activeElement).toBe(toggle);

        toggle.click();
        await waitForUpdatesAsync();
        if (!element.region!.initialLayoutComplete) {
            await waitForEvent(element.region!, 'loaded');
        }
        menu.addEventListener('change', () => destination.focus(), { once: true });
        item.click();
        await waitForUpdatesAsync();
        expect(element.open).toBeFalse();
        expect(document.activeElement).toBe(destination);

        toggle.click();
        await waitForUpdatesAsync();
        if (!element.region!.initialLayoutComplete) {
            await waitForEvent(element.region!, 'loaded');
        }
        destination.focus();
        item.click();
        await waitForUpdatesAsync();
        expect(element.open).toBeFalse();
        expect(document.activeElement).toBe(destination);
    });

    it('restores focus after selection when the split button is inside a shadow root', async () => {
        ({ element, connect, disconnect } = await fixture<FvSplitButton>(html`
            <${fvSplitButtonTag} label="Apply">
                <${menuTag} slot="menu">
                    <${menuItemTag}>First</${menuItemTag}>
                </${menuTag}>
            </${fvSplitButtonTag}>
        `));
        await connect();
        const host = document.createElement('div');
        element.parentElement!.append(host);
        const root = host.attachShadow({ mode: 'open' });
        root.append(element);
        const toggle = element.shadowRoot!.querySelector<HTMLButtonElement>('.split-button-toggle')!;
        const item = element.querySelector<HTMLElement>(menuItemTag)!;

        toggle.click();
        await waitForUpdatesAsync();
        if (!element.region!.initialLayoutComplete) {
            await waitForEvent(element.region!, 'loaded');
        }
        expect(root.activeElement).toBe(item);
        item.click();
        await waitForUpdatesAsync();
        expect(element.open).toBeFalse();
        expect(element.shadowRoot?.activeElement).toBe(toggle);
    });

    it('reopens the menu in the top layer without growing it', async () => {
        ({ element, connect, disconnect } = await fixture<FvSplitButton>(html`
            <${fvSplitButtonTag} label="Apply">
                <${menuTag} slot="menu">
                    <${menuItemTag}>Save as new</${menuItemTag}>
                </${menuTag}>
            </${fvSplitButtonTag}>
        `));
        await connect();
        const toggle = element.shadowRoot?.querySelector<HTMLButtonElement>('.split-button-toggle');
        const menu = element.querySelector(menuTag);
        if (!toggle || !menu) {
            throw new Error('Expected the toggle and slotted menu.');
        }
        let initialBounds: DOMRect | undefined;
        /* eslint-disable no-await-in-loop -- Reopening the same cached view requires sequential render cycles. */
        for (let cycle = 0; cycle < 4; cycle += 1) {
            toggle.click();
            await waitForUpdatesAsync();
            const region = element.region;
            if (!region) {
                throw new Error('Expected the menu region.');
            }
            if (!region.initialLayoutComplete) {
                await waitForEvent(region, 'loaded');
            }
            await new Promise<void>(resolve => {
                requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
            });
            expect(element.region?.matches(':popover-open')).withContext(`Open cycle ${cycle}`).toBeTrue();
            const bounds = menu.getBoundingClientRect();
            if (initialBounds) {
                expect(bounds.width).withContext(`Width on cycle ${cycle}`).toBeCloseTo(initialBounds.width, 0);
                expect(bounds.height).withContext(`Height on cycle ${cycle}`).toBeCloseTo(initialBounds.height, 0);
            } else {
                initialBounds = bounds;
                expect(bounds.width).toBeGreaterThan(0);
                expect(bounds.height).toBeGreaterThan(0);
            }
            if (cycle === 0) {
                menu.dispatchEvent(new Event('change', { bubbles: true }));
            } else if (cycle === 1) {
                toggle.click();
            } else if (cycle === 2) {
                document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
            } else {
                document.body.click();
            }
            await waitForUpdatesAsync();
            expect(element.open).toBeFalse();
        }
        /* eslint-enable no-await-in-loop */
        toggle.click();
        await waitForUpdatesAsync();
        const parent = element.parentElement;
        if (!parent) {
            throw new Error('Expected the connected fixture parent.');
        }
        element.remove();
        parent.append(element);
        await waitForUpdatesAsync();
        expect(element.region?.matches(':popover-open')).withContext('Reconnected while open').toBeTrue();
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

    it('emits trigger when the primary button is clicked', async () => {
        ({ element, connect, disconnect } = await setup());
        const triggerSpy = jasmine.createSpy('trigger');
        element.addEventListener('trigger', triggerSpy);
        await connect();

        (element.shadowRoot?.querySelector('.split-button-primary') as HTMLButtonElement | null)!.click();

        expect(triggerSpy).toHaveBeenCalled();
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