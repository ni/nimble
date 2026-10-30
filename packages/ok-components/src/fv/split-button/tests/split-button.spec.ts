import { html } from '@ni/fast-element';
import { menuTag } from '@ni/nimble-components/dist/esm/menu';
import { fillSelectedRgbPartialColor } from '@ni/nimble-components/dist/esm/theme-provider/design-tokens';
import { waitForUpdatesAsync } from '@ni/nimble-components/dist/esm/testing/async-helpers';
import { fixture, type Fixture } from '../../../utilities/tests/fixture';
import { FvSplitButton, fvSplitButtonTag } from '..';
import { FvSplitButtonAppearance } from '../types';

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

    Object.values(FvSplitButtonAppearance).forEach(appearance => {
        it(`uses an inset divider for ${appearance} appearance`, async () => {
            ({ element, connect, disconnect } = await setup());
            element.appearance = appearance;
            await connect();
            await waitForUpdatesAsync();

            const toggle = element.toggleButton!;
            const divider = getComputedStyle(toggle, '::after');
            expect(divider.content).toBe('""');
            expect(divider.top).toBe('4px');
            expect(divider.bottom).toBe('4px');
            expect(divider.width).toBe('2px');
            expect(getComputedStyle(toggle).borderColor).toBe('rgba(0, 0, 0, 0)');
            expect(getComputedStyle(toggle).backgroundOrigin).toBe('border-box');
            expect(getComputedStyle(toggle).backgroundImage).toBe('none');
            const primary = element.shadowRoot!.querySelector<HTMLButtonElement>('.split-button-primary')!;
            expect(getComputedStyle(primary).borderColor).toBe('rgba(0, 0, 0, 0)');
            expect(getComputedStyle(primary).backgroundOrigin).toBe('border-box');
            expect(getComputedStyle(primary).backgroundImage).toBe('none');
            const container = element.shadowRoot!.querySelector<HTMLDivElement>('.split-button-container')!;
            const outline = getComputedStyle(container, '::before');
            expect(outline.content).toBe('""');
            expect(outline.borderStyle).toBe('solid');
            expect(outline.borderWidth).toBe('1px');
            if (appearance === FvSplitButtonAppearance.block) {
                expect(outline.backgroundImage).toContain('linear-gradient');
            } else {
                expect(outline.backgroundImage).toBe('none');
            }
        });
    });

    it('anchors the content-sized menu to the leading edge of the toggle', async () => {
        ({ element, connect, disconnect } = await setup());
        element.open = true;
        await connect();
        await waitForUpdatesAsync();

        expect(element.region!.anchorElement).toBe(element.toggleButton!);
        expect(element.region!.horizontalScaling).toBe('content');
        expect(element.region!.horizontalDefaultPosition).toBe('end');
    });

    Object.values(FvSplitButtonAppearance).forEach(appearance => {
        it(`fills the open toggle for ${appearance} appearance`, async () => {
            ({ element, connect, disconnect } = await setup());
            element.appearance = appearance;
            element.open = true;
            await connect();
            element.toggleButton!.style.transition = 'none';
            await waitForUpdatesAsync();

            const toggle = element.toggleButton!;
            const style = getComputedStyle(toggle);
            expect(style.backgroundSize).toBe('100% 100%');
            expect(style.borderColor).toBe(`rgba(${fillSelectedRgbPartialColor.getValueFor(element)}, 0.3)`);
            expect(getComputedStyle(toggle, '::after').visibility).toBe('hidden');
        });
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