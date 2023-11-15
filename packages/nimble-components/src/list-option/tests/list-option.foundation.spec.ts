// Based on tests in FAST repo: https://github.com/microsoft/fast/blob/2ea80697bc3a5193e6123fb08ac3be2a76571aeb/packages/web-components/fast-foundation/src/listbox-option/listbox-option.spec.ts
import { ListOption } from '..';
import { waitForUpdatesAsync } from '../../testing/async-helpers';
import { fixture } from '../../utilities/tests/fixture';
import { template } from '../template';

describe('ListboxOption', () => {
    const option = ListOption.compose({
        baseName: 'option',
        template,
    });

    async function setup(): Promise<{
        element: ListOption,
        connect: () => Promise<void>,
        disconnect: () => Promise<void>
    }> {
        const { element, connect, disconnect } = await fixture(option());

        return { element, connect, disconnect };
    }

    it('should have a role of `option`', async () => {
        const { element, connect, disconnect } = await setup();

        await connect();

        expect(element.getAttribute('role')).toEqual('option');

        await disconnect();
    });

    it('should set the `aria-selected` attribute equal to the `selected` value', async () => {
        const { element, connect, disconnect } = await setup();

        element.selected = true;

        await connect();

        expect(element.getAttribute('aria-selected')).toEqual('true');

        element.selected = false;

        await waitForUpdatesAsync();

        expect(element.getAttribute('aria-selected')).toEqual('false');

        await disconnect();
    });

    it('should set the `aria-disabled` attribute equal to the `disabled` value', async () => {
        const { element, connect, disconnect } = await setup();

        element.disabled = true;

        await connect();

        expect(element.getAttribute('aria-disabled')).toEqual('true');

        element.disabled = false;

        await waitForUpdatesAsync();

        expect(element.getAttribute('aria-disabled')).toEqual('false');

        await disconnect();
    });

    it('should set the `aria-checked` attribute to match the `checked` property', async () => {
        const { element, connect, disconnect } = await setup();

        await connect();

        expect(element.hasAttribute('aria-checked')).toBeFalse();

        element.checked = true;

        await waitForUpdatesAsync();

        expect(element.getAttribute('aria-checked')).toEqual('true');

        element.checked = false;

        await waitForUpdatesAsync();

        expect(element.getAttribute('aria-checked')).toEqual('false');

        element.checked = undefined;

        await waitForUpdatesAsync();

        expect(element.hasAttribute('aria-checked')).toBeFalse();

        await disconnect();
    });

    it('should have an empty string `value` when the `value` attribute exists and is empty', async () => {
        const { connect, element, disconnect } = await setup();

        await connect();

        element.setAttribute('value', '');
        element.innerText = 'hello';

        expect(element.text).toEqual('hello');

        expect(element.value).toEqual('');

        await disconnect();
    });

    it('should return the text content when the `value` attribute does not exist', async () => {
        const { connect, element, disconnect } = await setup();

        await connect();

        element.innerText = 'hello';

        expect(element.text).toEqual('hello');

        expect(element.value).toEqual('hello');

        await disconnect();
    });

    it('should return the trimmed text content with the `text` property', async () => {
        const { connect, element, disconnect } = await setup();

        await connect();

        element.textContent = `
            hello
            world
        `;

        expect(element.text).toEqual('hello world');

        await disconnect();
    });

    it('should return the value as a string', async () => {
        const { element, connect, disconnect } = await setup();

        await connect();

        // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment
        element.value = 12345 as any;

        expect(element.value).toEqual('12345');

        expect(typeof element.value).toEqual('string');

        await disconnect();
    });
});