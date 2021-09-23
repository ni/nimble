import { DOM, ViewTemplate } from '@microsoft/fast-element';
import { fixture, Fixture } from '../../tests/utilities/fixture';
import type { Button } from '../index';
import '../index';

async function setup(): Promise<Fixture<Button>> {
    return fixture<Button>('nimble-button');
}

async function setupIconButtonWithContent(): Promise<Fixture<Button>> {
    return fixture<Button>(
        new ViewTemplate(
            `<nimble-button>
                <div slot='icon'>
                    <span></span>
                </div>
                Button
            </nimble-button>`,
            []
        )
    );
}

describe('Button', () => {
    it('should set the `autofocus` attribute on the internal button when provided', async () => {
        const { element, connect, disconnect } = await setup();

        element.autofocus = true;

        await connect();

        expect(
            element.shadowRoot
                ?.querySelector('button')
                ?.hasAttribute('autofocus')
        ).toBe(true);

        await disconnect();
    });

    it('when content added to `icon` slot, content ends up in `start` slot in shadow DOM', async () => {
        const { element, connect, disconnect } = await setupIconButtonWithContent();

        await connect();

        const slotContent = element.shadowRoot
            ?.querySelector<HTMLSlotElement>('slot[name="icon"]')
            ?.assignedNodes();
        expect(slotContent?.length).toBeGreaterThan(0);

        await disconnect();
    });

    describe("of type 'submit'", () => {
        it('should submit the parent form when clicked', async () => {
            const { element, parent, connect, disconnect } = await setup();
            const form = document.createElement('form');
            element.setAttribute('type', 'submit');
            form.appendChild(element);
            parent.appendChild(form);

            await connect();

            const wasSumbitted = await new Promise(resolve => {
                // Resolve as true when the event listener is handled
                form.addEventListener(
                    'submit',
                    (event: Event & { submitter: HTMLElement }) => {
                        event.preventDefault();
                        expect(event.submitter).toEqual(element.proxy);
                        resolve(true);
                    }
                );

                element.click();

                // Resolve false on the next update in case reset hasn't happened
                DOM.queueUpdate(() => resolve(false));
            });

            expect(wasSumbitted).toBe(true);

            await disconnect();
        });
    });
});
