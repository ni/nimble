import { html } from '@ni/fast-element';
import { waitForUpdatesAsync } from '@ni/nimble-components/dist/esm/testing/async-helpers';
import { fixture, type Fixture } from '../../utilities/tests/fixture';
import { SearchInput, searchInputTag } from '..';
import { SearchInputAppearance } from '../types';

async function setup(): Promise<Fixture<SearchInput>> {
    return await fixture<SearchInput>(html`
        <${searchInputTag} placeholder="Search assets"></${searchInputTag}>
    `);
}

describe('SearchInput', () => {
    let element: SearchInput;
    let connect: () => Promise<void>;
    let disconnect: (() => Promise<void>) | undefined;

    afterEach(async () => {
        await disconnect?.();
        disconnect = undefined;
    });

    it('can construct an element instance', () => {
        expect(document.createElement(searchInputTag)).toBeInstanceOf(SearchInput);
    });

    it('renders the configured placeholder', async () => {
        ({ element, connect, disconnect } = await setup());
        await connect();
        await waitForUpdatesAsync();

        const input = element.shadowRoot?.querySelector('input');
        expect(input?.getAttribute('placeholder')).toBe('Search assets');
    });

    it('uses a plain text input with a single custom clear button affordance', async () => {
        ({ element, connect, disconnect } = await setup());
        element.value = 'asset';
        await connect();
        await waitForUpdatesAsync();

        const input = element.shadowRoot?.querySelector('input');
        expect(input?.getAttribute('type')).toBe('text');
        expect(element.shadowRoot?.querySelectorAll('.search-input-clear').length).toBe(1);
    });

    it('clears the value when the clear button is clicked', async () => {
        ({ element, connect, disconnect } = await setup());
        element.value = 'asset';
        await connect();
        await waitForUpdatesAsync();

        const input = element.shadowRoot?.querySelector<HTMLInputElement>('input');
        const clearButton = element.shadowRoot?.querySelector<HTMLButtonElement>('.search-input-clear');
        clearButton?.focus();
        clearButton?.click();
        await waitForUpdatesAsync();

        expect(element.value).toBe('');
        expect(element.shadowRoot?.activeElement).toBe(input);
    });

    it('emits one input and one change event for a single input interaction', async () => {
        ({ element, connect, disconnect } = await setup());
        const inputSpy = jasmine.createSpy('input');
        const changeSpy = jasmine.createSpy('change');
        await connect();
        await waitForUpdatesAsync();

        element.addEventListener('input', inputSpy);
        element.addEventListener('change', changeSpy);

        const input = element.shadowRoot?.querySelector<HTMLInputElement>('input');
        input!.value = 'asset';
        input!.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
        input!.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
        await waitForUpdatesAsync();

        expect(inputSpy).toHaveBeenCalledTimes(1);
        expect(changeSpy).toHaveBeenCalledTimes(1);
    });

    it('defaults to outline appearance', async () => {
        ({ element, connect, disconnect } = await setup());
        await connect();

        expect(element.appearance).toBe(SearchInputAppearance.outline);
    });

    it('supports super-ghost appearance', async () => {
        ({ element, connect, disconnect } = await setup());
        element.appearance = SearchInputAppearance.superGhost;
        await connect();
        await waitForUpdatesAsync();

        expect(element.appearance).toBe(SearchInputAppearance.superGhost);
    });
});