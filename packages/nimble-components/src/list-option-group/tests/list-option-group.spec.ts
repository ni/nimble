import { html } from '@microsoft/fast-element';
import { ListOptionGroup, listOptionGroupTag } from '..';
import { fixture, type Fixture } from '../../utilities/tests/fixture';
import { waitForUpdatesAsync } from '../../testing/async-helpers';

describe('ListboxOptionGroup', () => {
    async function setup(): Promise<Fixture<ListOptionGroup>> {
        return fixture<ListOptionGroup>(
            html`<nimble-list-option-group style="width: 200px" label="Group 1">
            </nimble-list-option-group>`
        );
    }

    const getGroupLabelDisplay = (element: ListOptionGroup): string => {
        return (
            element.shadowRoot!.querySelector('.header')!.textContent?.trim()
            ?? ''
        );
    };

    it('should export its tag', () => {
        expect(listOptionGroupTag).toBe('nimble-list-option-group');
    });

    it('can construct an element instance', () => {
        expect(
            document.createElement('nimble-list-option-group')
        ).toBeInstanceOf(ListOptionGroup);
    });

    it('if label attribute and slotted label are provided, label attribute is displayed', async () => {
        const { element, connect, disconnect } = await setup();
        await connect();
        const slottedLabel = document.createElement('span');
        slottedLabel.textContent = 'Slotted Label';
        element.appendChild(slottedLabel);
        await waitForUpdatesAsync();

        expect(getGroupLabelDisplay(element)).toBe('Group 1');

        await disconnect();
    });

    it('if label attribute is not provided, slotted label is displayed', async () => {
        const { element, connect, disconnect } = await setup();
        await connect();
        const slottedLabel = document.createElement('span');
        slottedLabel.textContent = 'Slotted Label';
        element.label = undefined;
        element.appendChild(slottedLabel);
        await waitForUpdatesAsync();

        expect(getGroupLabelDisplay(element)).toBe('Slotted Label');
        await disconnect();
    });

    it('if multiple slotted labels are provided, all are appended to the labelContent', async () => {
        const { element, connect, disconnect } = await setup();
        await connect();
        element.label = undefined;
        const slottedLabel1 = document.createElement('span');
        slottedLabel1.textContent = 'Slotted Label 1';
        element.appendChild(slottedLabel1);
        const slottedLabel2 = document.createElement('span');
        slottedLabel2.textContent = 'Slotted Label 2';
        element.appendChild(slottedLabel2);
        await waitForUpdatesAsync();

        expect(getGroupLabelDisplay(element)).toBe(
            'Slotted Label 1 Slotted Label 2'
        );
        await disconnect();
    });

    describe('title overflow', () => {
        let element: ListOptionGroup;
        let connect: () => Promise<void>;
        let disconnect: () => Promise<void>;

        function dispatchEventToListOptionGroup(
            event: Event
        ): boolean | undefined {
            return element
                .shadowRoot!.querySelector('.header')!
                .dispatchEvent(event);
        }

        function getListOptionGroupTitle(): string {
            return (
                element
                    .shadowRoot!.querySelector('.header')!
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
            element.label = optionContent;
            await waitForUpdatesAsync();
            dispatchEventToListOptionGroup(new MouseEvent('mouseover'));
            await waitForUpdatesAsync();
            expect(getListOptionGroupTitle()).toBe(optionContent);
        });

        it('does not set title when option text is fully visible', async () => {
            const optionContent = 'short value';
            element.label = optionContent;
            dispatchEventToListOptionGroup(new MouseEvent('mouseover'));
            await waitForUpdatesAsync();
            expect(getListOptionGroupTitle()).toBe('');
        });

        it('removes title on mouseout of option', async () => {
            const optionContent = 'a very long value that should get ellipsized due to not fitting within the allocated width';
            element.label = optionContent;
            dispatchEventToListOptionGroup(new MouseEvent('mouseover'));
            await waitForUpdatesAsync();
            dispatchEventToListOptionGroup(new MouseEvent('mouseout'));
            await waitForUpdatesAsync();
            expect(getListOptionGroupTitle()).toBe('');
        });
    });
});
