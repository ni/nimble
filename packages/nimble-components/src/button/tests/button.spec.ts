import { DOM, ViewTemplate } from '@microsoft/fast-element';
import { fixture, Fixture } from '../../tests/utilities/fixture';
import type { Button } from '../index';
import '../index';

async function setup(): Promise<Fixture<Button>> {
    return fixture<Button>('nimble-button');
}

async function setupIconButtonWithNoContent(): Promise<Fixture<Button>> {
    return fixture<Button>(
        new ViewTemplate(
            `<nimble-button><div slot='icon'>
                <span></span>
            </div></nimble-button>`,
            []
        )
    );
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

    it('should not have content with `iconContent` class when no item provided to `icon` slot', async () => {
        const { element, connect, disconnect } = await setup();

        await connect();

        expect(
            element.shadowRoot
                ?.querySelector('.iconContent')
        ).toBeNull();

        await disconnect();
    });

    it('should have content with `iconContent` class when item provided to `icon` slot', async () => {
        const { element, connect, disconnect } = await setupIconButtonWithContent();

        await connect();

        expect(
            element.shadowRoot
                ?.querySelector('.iconContent')
        ).toBeDefined();

        await disconnect();
    });

    it('shoud not set the `iconWithNoButtonContent` on the internal button content when there is an icon and content is present', async () => {
        const { element, connect, disconnect } = await setupIconButtonWithContent();

        await connect();
        await DOM.nextUpdate();
        expect(
            element.shadowRoot
                ?.querySelector('.content')
                ?.classList.contains('iconWithNoButtonContent')
        ).toBe(false);

        await disconnect();
    });

    it('shoud set the `iconWithNoButtonContent` on the internal button content when there is an icon and no content is present', async () => {
        const { element, connect, disconnect } = await setupIconButtonWithNoContent();

        await connect();
        await DOM.nextUpdate();
        expect(
            element.shadowRoot
                ?.querySelector('.content')
                ?.classList.contains('iconWithNoButtonContent')
        ).toBe(true);

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
