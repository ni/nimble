import { html } from '@microsoft/fast-element';
import { fixture, Fixture } from '../../tests/utilities/fixture';
import type { Button } from '../index';
import '../index';

async function setup(): Promise<Fixture<Button>> {
    return fixture<Button>(
        // prettier-ignore
        html`<nimble-button>
                <div slot='icon'><span></span></div>
                Button
            </nimble-button>`
    );
}

describe('Button', () => {
    it('when content added to `icon` slot, content ends up in `start` slot in shadow DOM', async () => {
        const { element, connect, disconnect } = await setup();

        await connect();

        const slotContent = element
            .shadowRoot!.querySelector<HTMLSlotElement>('slot[name="icon"]')!
            .assignedNodes();
        expect(slotContent.length).toBeGreaterThan(0);

        await disconnect();
    });
});
