import { html } from '@ni/fast-element';
import { waitForUpdatesAsync } from '@ni/nimble-components/dist/esm/testing/async-helpers';
import { fixture, type Fixture } from '../../../utilities/tests/fixture';
import { FvExpandableChip, fvExpandableChipTag } from '..';

async function setup(): Promise<Fixture<FvExpandableChip>> {
    const result = await fixture<FvExpandableChip>(html`
        <${fvExpandableChipTag} accessible-label="Edit status" controls="status-editor">Status: Failed</${fvExpandableChipTag}>
    `);
    await result.connect();
    await waitForUpdatesAsync();
    return result;
}

describe('FvExpandableChip', () => {
    let element: FvExpandableChip;
    let disconnect: (() => Promise<void>) | undefined;

    afterEach(async () => {
        await disconnect?.();
        disconnect = undefined;
    });

    it('can construct and register an element instance', () => {
        expect(document.createElement(fvExpandableChipTag)).toBeInstanceOf(FvExpandableChip);
    });

    it('renders an expandable block-style button with its accessible relationship', async () => {
        ({ element, disconnect } = await setup());

        const button = element.shadowRoot?.querySelector<HTMLButtonElement>('button');
        expect(element.textContent).toContain('Status: Failed');
        expect(button?.getAttribute('aria-label')).toBe('Edit status');
        expect(button?.getAttribute('aria-haspopup')).toBe('dialog');
        expect(button?.getAttribute('aria-expanded')).toBe('false');
        expect(button?.getAttribute('aria-controls')).toBe('status-editor');

        element.expanded = true;
        await waitForUpdatesAsync();
        expect(button?.getAttribute('aria-expanded')).toBe('true');
    });

    it('lets the host handle activation', async () => {
        ({ element, disconnect } = await setup());
        const clickSpy = jasmine.createSpy('click');
        element.addEventListener('click', clickSpy);

        element.shadowRoot?.querySelector<HTMLButtonElement>('button')?.click();

        expect(clickSpy).toHaveBeenCalledTimes(1);
    });
});
