import { html } from '@ni/fast-element';
import { Checkbox, checkboxTag } from '..';
import { fixture, type Fixture } from '../../utilities/tests/fixture';
import { waitForUpdatesAsync } from '../../testing/async-helpers';

describe('Checkbox', () => {
    let i = 0;
    async function setup(): Promise<Fixture<Checkbox>> {
        return await fixture<Checkbox>(html`<${checkboxTag}></${checkboxTag}>`);
    }

    beforeEach(() => {
        // eslint-disable-next-line no-console
        console.log(`current i ${i} `);
    });

    it('can construct an element instance', () => {
        if (i < 2) {
            // eslint-disable-next-line no-plusplus
            throw new Error(`fail ${i++}`);
        }
        expect(document.createElement(checkboxTag)).toBeInstanceOf(Checkbox);
    });

    it('should honor provided `tabindex` value', async () => {
        const { element, connect, disconnect } = await setup();
        element.setAttribute('tabindex', '-1');
        await connect();

        expect(element.getAttribute('tabindex')).toEqual('-1');
        expect(element.tabIndex).toEqual(-1);

        await disconnect();
    });

    it('should default `tabindex` back to 0 when removed', async () => {
        const { element, connect, disconnect } = await setup();
        element.setAttribute('tabindex', '-1');
        await connect();

        element.removeAttribute('tabindex');
        await waitForUpdatesAsync();

        expect(element.getAttribute('tabindex')).toEqual('0');
        expect(element.tabIndex).toEqual(0);

        await disconnect();
    });
});
