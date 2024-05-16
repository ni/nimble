import { html } from '@microsoft/fast-element';
import { Checkbox, checkboxTag } from '..';
import { fixture, type Fixture } from '../../utilities/tests/fixture';
import { waitForUpdatesAsync } from '../../testing/async-helpers';

describe('Checkbox', () => {
    async function setup(tabIndex?: string): Promise<Fixture<Checkbox>> {
        return fixture<Checkbox>(
            html`<${checkboxTag} ${tabIndex ? `tabindex=${tabIndex}` : ''}></${checkboxTag}>`
        );
    }

    it('should export its tag', () => {
        expect(checkboxTag).toBe('nimble-checkbox');
    });

    it('can construct an element instance', () => {
        expect(document.createElement('nimble-checkbox')).toBeInstanceOf(
            Checkbox
        );
    });

    it('should honor provided `tabindex` value', async () => {
        const { element, connect, disconnect } = await setup('-1');
        await connect();

        expect(element.getAttribute('tabindex')).toEqual('-1');
        expect(element.tabIndex).toEqual(-1);

        await disconnect();
    });

    it('should default `tabindex` back to 0 when changed to null', async () => {
        const { element, connect, disconnect } = await setup('-1');
        await connect();

        element.setAttribute('tabindex', 'null');
        await waitForUpdatesAsync();

        expect(element.getAttribute('tabindex')).toEqual('0');
        expect(element.tabIndex).toEqual(0);

        await disconnect();
    });

    it('should default `tabindex` back to 0 when removed', async () => {
        const { element, connect, disconnect } = await setup('-1');
        await connect();

        element.removeAttribute('tabindex');
        await waitForUpdatesAsync();

        expect(element.getAttribute('tabindex')).toEqual('0');
        expect(element.tabIndex).toEqual(0);

        await disconnect();
    });
});
