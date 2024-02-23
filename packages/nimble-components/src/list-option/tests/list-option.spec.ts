import { html } from '@microsoft/fast-element';
import { ListOption, listOptionTag } from '..';
import { fixture, type Fixture } from '../../utilities/tests/fixture';
import { waitForUpdatesAsync } from '../../testing/async-helpers';
import type { Select } from '../../select';

describe('ListboxOption', () => {
    it('should export its tag', () => {
        expect(listOptionTag).toBe('nimble-list-option');
    });

    it('can construct an element instance', () => {
        expect(document.createElement('nimble-list-option')).toBeInstanceOf(
            ListOption
        );
    });

    describe('title overflow', () => {
        let element: ListOption;
        let connect: () => Promise<void>;
        let disconnect: () => Promise<void>;

        async function setup(): Promise<Fixture<ListOption>> {
            return fixture<ListOption>(
                html`<nimble-list-option style="width: 200px">
                    Item 1
                </nimble-list-option>`
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

    describe('ListOption with Select parent', () => {
        let element: Select;
        let connect: () => Promise<void>;
        let disconnect: () => Promise<void>;

        async function setup(): Promise<Fixture<Select>> {
            return fixture<Select>(
                html`<nimble-select>
                    <nimble-list-option style="width: 200px" value="1">
                        Item 1
                    </nimble-list-option>
                    <nimble-list-option style="width: 200px" value="2">
                        Item 2
                    </nimble-list-option>
                </nimble-select>`
            );
        }

        beforeEach(async () => {
            ({ element, connect, disconnect } = await setup());
            await connect();
            await waitForUpdatesAsync();
        });

        afterEach(async () => {
            await disconnect();
        });

        it('updating hidden attribute sets/removes ".hidden-option" class', () => {
            const option = element.options[0]!;
            option.hidden = true;
            expect(option.classList.contains('hidden-option')).toBeTrue();

            option.hidden = false;
            expect(option.classList.contains('hidden-option')).toBeFalse();
        });

        it('setting hidden property calls "updateDisplayValue" on parent', () => {
            const updateDisplayValueSpy = spyOn(element, 'updateDisplayValue');
            const option = element.options[0]!;
            option.hidden = true;

            expect(updateDisplayValueSpy.calls.any()).toBeTrue();
        });

        it('setting disabled property calls "updateDisplayValue" on parent', () => {
            const updateDisplayValueSpy = spyOn(element, 'updateDisplayValue');
            const option = element.options[0]!;
            option.disabled = true;

            expect(updateDisplayValueSpy.calls.any()).toBeTrue();
        });

        it('setting selected property calls "updateDisplayValue" on parent', () => {
            const updateDisplayValueSpy = spyOn(element, 'updateDisplayValue');
            const option = element.options[1]!; // select second option
            option.selected = true;

            expect(updateDisplayValueSpy.calls.any()).toBeTrue();
        });
    });
});
