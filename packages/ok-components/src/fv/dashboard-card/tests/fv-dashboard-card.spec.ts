import { html, type ViewTemplate } from '@ni/fast-element';
import { waitForUpdatesAsync } from '@ni/nimble-components/dist/esm/testing/async-helpers';
import { FvDashboardCard, fvDashboardCardTag } from '..';
import { FvDashboardCardCorners, FvDashboardCardLayout, FvDashboardCardSeverity } from '../types';
import { fixture, type Fixture } from '../../../utilities/tests/fixture';

async function setup(
    markup: ViewTemplate = html`<${fvDashboardCardTag}></${fvDashboardCardTag}>`
): Promise<Fixture<FvDashboardCard>> {
    return await fixture<FvDashboardCard>(markup);
}

describe('FvDashboardCard', () => {
    let element: FvDashboardCard;
    let connect: () => Promise<void>;
    let disconnect: (() => Promise<void>) | undefined;

    afterEach(async () => {
        await disconnect?.();
        disconnect = undefined;
    });

    it('can construct an element instance', () => {
        expect(document.createElement(fvDashboardCardTag)).toBeInstanceOf(FvDashboardCard);
    });

    it('reflects layout, corners, and severity changes for consumers', async () => {
        ({ element, connect, disconnect } = await setup());
        await connect();
        element.layout = FvDashboardCardLayout.hero;
        element.corners = FvDashboardCardCorners.square;
        element.severity = FvDashboardCardSeverity.warning;
        await waitForUpdatesAsync();
        expect(element.getAttribute('layout')).toBe('hero');
        expect(element.getAttribute('corners')).toBe('square');
        expect(element.getAttribute('severity')).toBe('warning');
    });

    it('keeps actions separate from status and updates optional icon and action regions', async () => {
        ({ element, connect, disconnect } = await setup(
            html`<${fvDashboardCardTag}>
                <span slot="icon">Alarm</span>
                <button slot="actions" type="button">Acknowledge</button>
                <span slot="status">Warning</span>
            </${fvDashboardCardTag}>`
        ));
        await connect();
        await waitForUpdatesAsync();
        const icon = element.shadowRoot!.querySelector<HTMLElement>('.icon')!;
        const actions = element.shadowRoot!.querySelector<HTMLElement>('.actions')!;
        expect(icon.hidden).toBeFalse();
        expect(actions.querySelector<HTMLSlotElement>('slot')!.assignedElements()).toEqual([
            element.querySelector('[slot="actions"]')!
        ]);
        element.querySelector('[slot="icon"]')!.remove();
        element.querySelector('[slot="actions"]')!.remove();
        await waitForUpdatesAsync();
        expect(icon.hidden).toBeTrue();
        expect(actions.hidden).toBeTrue();
        expect(element.shadowRoot!.querySelector<HTMLElement>('.header-end')!.hidden).toBeFalse();
    });

    it('keeps the subtitle in the header and updates the header when it is removed or added', async () => {
        ({ element, connect, disconnect } = await setup(
            html`<${fvDashboardCardTag}>
                <span slot="subtitle">Temperature is above the configured threshold.</span>
            </${fvDashboardCardTag}>`
        ));
        await connect();
        await waitForUpdatesAsync();

        const header = element.shadowRoot!.querySelector<HTMLElement>('.header-row')!;
        const subtitleSlot = header.querySelector<HTMLSlotElement>('slot[name="subtitle"]')!;
        const subtitle = element.querySelector<HTMLElement>('[slot="subtitle"]')!;
        expect(subtitleSlot.assignedElements()).toEqual([subtitle]);
        expect(header.hidden).toBeFalse();

        subtitle.remove();
        await waitForUpdatesAsync();
        expect(header.hidden).toBeTrue();

        element.appendChild(subtitle);
        await waitForUpdatesAsync();
        expect(header.hidden).toBeFalse();
    });

    it('updates icon alignment when context or title content changes', async () => {
        ({ element, connect, disconnect } = await setup(
            html`<${fvDashboardCardTag}>
                <span slot="icon">Icon</span>
                <span slot="title">Title</span>
            </${fvDashboardCardTag}>`
        ));
        await connect();
        await waitForUpdatesAsync();
        const icon = element.shadowRoot!.querySelector<HTMLElement>('.icon')!;
        expect(icon.classList.contains('align-title')).toBeTrue();

        const context = document.createElement('span');
        context.slot = 'context';
        element.append(context);
        await waitForUpdatesAsync();
        expect(icon.classList.contains('align-title')).toBeFalse();

        context.remove();
        await waitForUpdatesAsync();
        expect(icon.classList.contains('align-title')).toBeTrue();

        element.querySelector('[slot="title"]')!.remove();
        await waitForUpdatesAsync();
        expect(icon.classList.contains('align-title')).toBeFalse();
    });

    it('hides optional regions when their slots are empty and updates when content changes', async () => {
        ({ element, connect, disconnect } = await setup(
            html`<${fvDashboardCardTag}>
                <span slot="title">CPU temperature</span>
                <span slot="supporting">Peak 73 °C</span>
            </${fvDashboardCardTag}>`
        ));
        await connect();
        await waitForUpdatesAsync();

        const header = element.shadowRoot?.querySelector<HTMLElement>('.header-row');
        const content = element.shadowRoot?.querySelector<HTMLElement>('.content');
        const supporting = element.shadowRoot?.querySelector<HTMLElement>('.supporting');
        const footer = element.shadowRoot?.querySelector<HTMLElement>('.footer');
        expect(header?.hasAttribute('hidden')).toBeFalse();
        expect(content?.hasAttribute('hidden')).toBeTrue();
        expect(supporting?.hasAttribute('hidden')).toBeFalse();
        expect(footer?.hasAttribute('hidden')).toBeTrue();

        element.querySelector('[slot="supporting"]')?.remove();
        await waitForUpdatesAsync();

        expect(supporting?.hasAttribute('hidden')).toBeTrue();
    });
});
