import { html } from '@ni/fast-element';
import { waitForUpdatesAsync } from '@ni/nimble-components/dist/esm/testing/async-helpers';
import { fixture, type Fixture } from '../../utilities/tests/fixture';
import { FvSearchInput, fvSearchInputTag } from '..';
import { FvSearchInputAppearance } from '../types';
import { FvSearchInputPageObject } from '../testing/fv-search-input.pageobject';

async function setup(): Promise<Fixture<FvSearchInput>> {
    return await fixture<FvSearchInput>(html`
        <${fvSearchInputTag} placeholder="Search assets"></${fvSearchInputTag}>
    `);
}

describe('FvSearchInput', () => {
    let element: FvSearchInput;
    let pageObject: FvSearchInputPageObject;
    let connect: () => Promise<void>;
    let disconnect: (() => Promise<void>) | undefined;

    afterEach(async () => {
        await disconnect?.();
        disconnect = undefined;
    });

    it('can construct an element instance', () => {
        expect(document.createElement(fvSearchInputTag)).toBeInstanceOf(FvSearchInput);
    });

    it('defaults to empty placeholder', async () => {
        ({ element, connect, disconnect } = await fixture<FvSearchInput>(html`
            <${fvSearchInputTag}></${fvSearchInputTag}>
        `));
        await connect();
        await waitForUpdatesAsync();

        pageObject = new FvSearchInputPageObject(element);
        expect(pageObject.getPlaceholder()).toBe('');
    });

    it('renders the configured placeholder', async () => {
        ({ element, connect, disconnect } = await setup());
        await connect();
        await waitForUpdatesAsync();

        pageObject = new FvSearchInputPageObject(element);
        expect(pageObject.getPlaceholder()).toBe('Search assets');
    });

    it('uses a plain text input with a single custom clear button affordance', async () => {
        ({ element, connect, disconnect } = await setup());
        element.value = 'asset';
        await connect();
        await waitForUpdatesAsync();

        pageObject = new FvSearchInputPageObject(element);
        expect(pageObject.isClearButtonVisible()).toBeTrue();
    });

    it('clears the value when the clear button is clicked', async () => {
        ({ element, connect, disconnect } = await setup());
        element.value = 'asset';
        await connect();
        await waitForUpdatesAsync();

        pageObject = new FvSearchInputPageObject(element);
        await pageObject.clickClearButton();

        expect(element.value).toBe('');
        expect(pageObject.getInputValue()).toBe('');
    });

    it('emits one input and one change event for a single input interaction', async () => {
        ({ element, connect, disconnect } = await setup());
        const inputSpy = jasmine.createSpy('input');
        const changeSpy = jasmine.createSpy('change');
        await connect();
        await waitForUpdatesAsync();

        element.addEventListener('input', inputSpy);
        element.addEventListener('change', changeSpy);

        pageObject = new FvSearchInputPageObject(element);
        await pageObject.typeText('asset');

        expect(inputSpy).toHaveBeenCalledTimes(1);
        expect(changeSpy).toHaveBeenCalledTimes(0);
    });

    it('defaults to outline appearance', async () => {
        ({ element, connect, disconnect } = await setup());
        await connect();

        expect(element.appearance).toBe(FvSearchInputAppearance.outline);
    });

    it('supports super-ghost appearance', async () => {
        ({ element, connect, disconnect } = await setup());
        element.appearance = FvSearchInputAppearance.superGhost;
        await connect();
        await waitForUpdatesAsync();

        expect(element.appearance).toBe(FvSearchInputAppearance.superGhost);
    });
});