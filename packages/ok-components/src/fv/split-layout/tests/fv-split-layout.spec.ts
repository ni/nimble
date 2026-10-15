import { html } from '@ni/fast-element';
import { waitForUpdatesAsync } from '@ni/nimble-components/dist/esm/testing/async-helpers';
import { fixture } from '../../../utilities/tests/fixture';
import { type FvSplitLayout, fvSplitLayoutTag } from '..';

describe('FvSplitLayout', () => {
    let element: FvSplitLayout;
    let disconnect: (() => Promise<void>) | undefined;

    beforeEach(async () => {
        let connect: () => Promise<void>;
        ({ element, connect, disconnect } = await fixture<FvSplitLayout>(html`
            <${fvSplitLayoutTag} style="width: 1000px; height: 420px">
                <div slot="primary" id="primary-content"></div>
                <div slot="secondary" id="secondary-content"></div>
            </${fvSplitLayoutTag}>
        `));
        await connect();
        await new Promise<void>(resolve => {
            requestAnimationFrame(() => resolve());
        });
        await waitForUpdatesAsync();
    });

    afterEach(async () => {
        await disconnect?.();
        disconnect = undefined;
    });

    it('renders full-height pane tracks and controls both panes', async () => {
        await waitForUpdatesAsync();
        const layout = element.shadowRoot!.querySelector<HTMLElement>('.layout')!;
        const splitter = element.shadowRoot!.querySelector('ok-fv-splitter')!;

        expect(layout.style.gridTemplateColumns).toBe('minmax(0px, 60fr) 2px minmax(300px, 40fr)');
        expect(splitter.ariaControls).toBe(`${element.primaryPaneId} ${element.secondaryPaneId}`);
    });

    it('constrains the secondary pane to its minimum pixel width', async () => {
        element.availableWidth = 1000;
        element.position = 75;
        element.minSecondaryPixels = 300;
        await waitForUpdatesAsync();

        expect(element.effectiveMax).toBeCloseTo(100 * (1 - 300 / 998), 5);
        expect(element.position).toBe(element.effectiveMax);
    });

    it('prioritizes the secondary pixel minimum over the primary percentage minimum', async () => {
        element.style.width = '445px';
        await new Promise(resolve => {
            requestAnimationFrame(resolve);
        });
        await new Promise(resolve => {
            requestAnimationFrame(resolve);
        });
        await waitForUpdatesAsync();
        const secondary = element.querySelector<HTMLElement>('[slot="secondary"]')!;
        const primary = element.querySelector<HTMLElement>('[slot="primary"]')!;
        expect(secondary.getBoundingClientRect().width).toBeGreaterThanOrEqual(299.9);
        expect(primary.getBoundingClientRect().height).toBe(420);
        expect(secondary.getBoundingClientRect().height).toBe(420);
        expect(element.effectiveMin).toBeLessThan(35);
    });

    it('preserves slotted DOM and position while collapsed', async () => {
        const secondary = element.querySelector('#secondary-content');
        element.position = 65;
        element.collapsed = true;
        await waitForUpdatesAsync();

        expect(element.querySelector('#secondary-content')).toBe(secondary);
        expect(element.position).toBe(65);
        expect(element.shadowRoot!.querySelector('ok-fv-splitter')).toBeNull();

        element.collapsed = false;
        await waitForUpdatesAsync();
        expect(element.position).toBe(65);
        expect(element.shadowRoot!.querySelector('ok-fv-splitter')).not.toBeNull();
    });

    it('forwards splitter input and change from the layout host', async () => {
        const inputSpy = jasmine.createSpy();
        const changeSpy = jasmine.createSpy();
        element.addEventListener('input', inputSpy);
        element.addEventListener('change', changeSpy);
        const splitter = element.shadowRoot!.querySelector('ok-fv-splitter')!;
        splitter.position = 55;

        splitter.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
        splitter.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
        await waitForUpdatesAsync();

        expect(element.position).toBe(55);
        expect(inputSpy).toHaveBeenCalledTimes(1);
        expect(changeSpy).toHaveBeenCalledTimes(1);
    });

    it('reconstrains the splitter when expanding into a narrower container', async () => {
        element.collapsed = true;
        element.availableWidth = 445;
        element.collapsed = false;
        await waitForUpdatesAsync();

        expect(element.position).toBe(element.effectiveMax);
        const splitter = element.shadowRoot!.querySelector('ok-fv-splitter')!;
        expect(splitter.position).toBeLessThanOrEqual(splitter.max);
    });
});
