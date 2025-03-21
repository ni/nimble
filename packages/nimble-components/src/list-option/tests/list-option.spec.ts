import { html } from '@ni/fast-element';
import { ListOption, listOptionTag } from '..';
import { fixture, type Fixture } from '../../utilities/tests/fixture';
import { waitForUpdatesAsync } from '../../testing/async-helpers';

describe('ListboxOption', () => {
    it('can construct an element instance', () => {
        expect(document.createElement(listOptionTag)).toBeInstanceOf(
            ListOption
        );
    });

    describe('title overflow', () => {
        let element: ListOption;
        let connect: () => Promise<void>;
        let disconnect: () => Promise<void>;

        async function setup(): Promise<Fixture<ListOption>> {
            return await fixture<ListOption>(
                html`<${listOptionTag} style="width: 200px">
                    Item 1
                </${listOptionTag}>`
            );
        }

        function dispatchEventToListOption(event: Event): boolean | undefined {
            return element
                .shadowRoot!.querySelector('.content')!
                .dispatchEvent(event);
        }

        function getListOptionTitle(): string {
            return (
                element
                    .shadowRoot!.querySelector('.content')!
                    .getAttribute('title') ?? ''
            );
        }

        beforeEach(async () => {
            ({ element, connect, disconnect } = await setup());
            await connect();
        });

        afterEach(async () => {
            await disconnect();
        });

        it('sets title when option text is ellipsized', async () => {
            const optionContent = 'a very long value that should get ellipsized due to not fitting within the allocated width';
            element.textContent = optionContent;
            dispatchEventToListOption(new MouseEvent('mouseover'));
            await waitForUpdatesAsync();
            expect(getListOptionTitle()).toBe(optionContent);
        });

        it('does not set title when option text is fully visible', async () => {
            const optionContent = 'short value';
            element.textContent = optionContent;
            dispatchEventToListOption(new MouseEvent('mouseover'));
            await waitForUpdatesAsync();
            expect(getListOptionTitle()).toBe('');
        });

        it('removes title on mouseout of option', async () => {
            const optionContent = 'a very long value that should get ellipsized due to not fitting within the allocated width';
            element.textContent = optionContent;
            dispatchEventToListOption(new MouseEvent('mouseover'));
            await waitForUpdatesAsync();
            dispatchEventToListOption(new MouseEvent('mouseout'));
            await waitForUpdatesAsync();
            expect(getListOptionTitle()).toBe('');
        });
    });
});
