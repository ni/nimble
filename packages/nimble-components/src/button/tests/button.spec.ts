import { html } from '@microsoft/fast-element';
import { Button, buttonTag } from '..';
import { fixture, type Fixture } from '../../utilities/tests/fixture';
import { waitForUpdatesAsync } from '../../testing/async-helpers';

describe('Button', () => {
    async function setup(tabIndex?: string): Promise<Fixture<Button>> {
        return fixture<Button>(
            html`<${buttonTag} ${tabIndex ? `tabindex=${tabIndex}` : ''}></${buttonTag}>`
        );
    }

    it('should export its tag', () => {
        expect(buttonTag).toBe('nimble-button');
    });

    it('can construct an element instance', () => {
        expect(document.createElement('nimble-button')).toBeInstanceOf(Button);
    });

    it('should default tabIndex on the internal button to 0', async () => {
        const { element, connect, disconnect } = await setup();
        await connect();

        const innerButton = element.shadowRoot!.querySelector('button')!;
        expect(innerButton.getAttribute('tabindex')).toBeNull();
        expect(innerButton.tabIndex).toEqual(0);

        await disconnect();
    });

    it('should set the `tabindex` attribute on the internal button when provided', async () => {
        const { element, connect, disconnect } = await setup('-1');
        await connect();

        const innerButton = element.shadowRoot!.querySelector('button')!;
        expect(innerButton.getAttribute('tabindex')).toEqual('-1');
        expect(innerButton.tabIndex).toEqual(-1);

        await disconnect();
    });

    it('should clear the `tabindex` attribute on the internal button when cleared from the host', async () => {
        const { element, connect, disconnect } = await setup('-1');
        await connect();

        element.removeAttribute('tabindex');
        await waitForUpdatesAsync();

        const innerButton = element.shadowRoot!.querySelector('button')!;
        expect(innerButton.getAttribute('tabindex')).toBeNull();
        expect(innerButton.tabIndex).toEqual(0);

        await disconnect();
    });
});
