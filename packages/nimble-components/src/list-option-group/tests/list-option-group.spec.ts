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

    it('should export its tag', () => {
        expect(listOptionGroupTag).toBe('nimble-list-option-group');
    });

    it('can construct an element instance', () => {
        expect(
            document.createElement('nimble-list-option-group')
        ).toBeInstanceOf(ListOptionGroup);
    });

    it('if label attribute is provided, labelContent is set to label attribute', async () => {
        const { element, connect, disconnect } = await setup();
        await connect();

        expect(element.labelContent).toBe('Group 1');

        await disconnect();
    });

    it('if label attribute is undefined, and slotted label is provided as a span, labelContent is set to slotted label', async () => {
        const { element, connect, disconnect } = await setup();
        await connect();
        element.label = undefined;
        const slottedLabel = document.createElement('span');
        slottedLabel.textContent = 'Slotted Label';
        element.appendChild(slottedLabel);
        await waitForUpdatesAsync();

        expect(element.labelContent).toBe('Slotted Label');

        await disconnect();
    });

    it('if label attribute is undefined, and slotted label is provided as text node, labelContent is set to slotted label', async () => {
        const { element, connect, disconnect } = await setup();
        await connect();
        element.label = undefined;
        const slottedLabel = document.createTextNode('Slotted Label');
        element.appendChild(slottedLabel);
        await waitForUpdatesAsync();

        expect(element.labelContent).toBe('Slotted Label');

        await disconnect();
    });

    it('if label attribute is undefined, and multiple slotted labels are provided, labelContent is set to joined strings of slotted labels', async () => {
        const { element, connect, disconnect } = await setup();
        await connect();
        element.label = undefined;
        const slottedLabel = document.createElement('span');
        slottedLabel.textContent = 'Slotted Label';
        element.appendChild(slottedLabel);
        const slottedLabel2 = document.createElement('span');
        slottedLabel2.textContent = 'Slotted Label 2';
        element.appendChild(slottedLabel2);
        await waitForUpdatesAsync();

        expect(element.labelContent).toBe('Slotted Label Slotted Label 2');

        await disconnect();
    });

    it('if label attribute and slotted label are provided, labelContent is set to label attribute', async () => {
        const { element, connect, disconnect } = await setup();
        await connect();
        const slottedLabel = document.createElement('span');
        slottedLabel.textContent = 'Slotted Label';
        element.appendChild(slottedLabel);
        await waitForUpdatesAsync();

        expect(element.labelContent).toBe('Group 1');

        await disconnect();
    });

    it('if multiple slotted labels are provided with extra whitespace, labelContent result is trimmed', async () => {
        const { element, connect, disconnect } = await setup();
        await connect();
        element.label = undefined;
        const slottedLabel1 = document.createElement('span');
        slottedLabel1.textContent = '  Slotted Label 1 ';
        element.appendChild(slottedLabel1);
        const slottedLabel2 = document.createElement('span');
        slottedLabel2.textContent = '     Slotted Label 2 ';
        element.appendChild(slottedLabel2);
        await waitForUpdatesAsync();

        expect(element.labelContent).toBe('Slotted Label 1 Slotted Label 2');
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
                .shadowRoot!.querySelector('.label-display')!
                .dispatchEvent(event);
        }

        function getListOptionGroupTitle(): string {
            return (
                element
                    .shadowRoot!.querySelector('.label-display')!
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

        it('sets title when group text is ellipsized when using label attribute', async () => {
            const groupLabel = 'a very long value that should get ellipsized due to not fitting within the allocated width';
            element.label = groupLabel;
            await waitForUpdatesAsync();
            dispatchEventToListOptionGroup(new MouseEvent('mouseover'));
            await waitForUpdatesAsync();
            expect(getListOptionGroupTitle()).toBe(groupLabel);
        });

        it('does not set title when group text is fully visible when using label attribute', async () => {
            const groupLabel = 'short value';
            element.label = groupLabel;
            dispatchEventToListOptionGroup(new MouseEvent('mouseover'));
            await waitForUpdatesAsync();
            expect(getListOptionGroupTitle()).toBe('');
        });

        it('removes title on mouseout of group when using label attribute', async () => {
            const groupLabel = 'a very long value that should get ellipsized due to not fitting within the allocated width';
            element.label = groupLabel;
            dispatchEventToListOptionGroup(new MouseEvent('mouseover'));
            await waitForUpdatesAsync();
            dispatchEventToListOptionGroup(new MouseEvent('mouseout'));
            await waitForUpdatesAsync();
            expect(getListOptionGroupTitle()).toBe('');
        });

        it('sets title when group text is ellipsized when using slotted label', async () => {
            const groupLabel = 'a very long value that should get ellipsized due to not fitting within the allocated width';
            element.label = undefined;
            const slottedLabel = document.createElement('span');
            slottedLabel.textContent = groupLabel;
            element.appendChild(slottedLabel);
            await waitForUpdatesAsync();
            dispatchEventToListOptionGroup(new MouseEvent('mouseover'));
            await waitForUpdatesAsync();
            expect(getListOptionGroupTitle()).toEqual(groupLabel);
        });

        it('does not set title when group text is fully visible when using slotted label', async () => {
            const groupLabel = 'short value';
            element.label = undefined;
            const slottedLabel = document.createElement('span');
            slottedLabel.textContent = groupLabel;
            element.appendChild(slottedLabel);
            dispatchEventToListOptionGroup(new MouseEvent('mouseover'));
            await waitForUpdatesAsync();
            expect(getListOptionGroupTitle()).toBe('');
        });

        it('removes title on mouseout of group when using slotted label', async () => {
            const groupLabel = 'a very long value that should get ellipsized due to not fitting within the allocated width';
            element.label = undefined;
            const slottedLabel = document.createElement('span');
            slottedLabel.textContent = groupLabel;
            element.appendChild(slottedLabel);
            dispatchEventToListOptionGroup(new MouseEvent('mouseover'));
            await waitForUpdatesAsync();
            dispatchEventToListOptionGroup(new MouseEvent('mouseout'));
            await waitForUpdatesAsync();
            expect(getListOptionGroupTitle()).toBe('');
        });

        it('updating slotted label updates title', async () => {
            const groupLabel = 'a very long value that should get ellipsized due to not fitting within the allocated width';
            element.label = undefined;
            const slottedLabel = document.createElement('span');
            slottedLabel.textContent = groupLabel;
            element.appendChild(slottedLabel);
            await waitForUpdatesAsync();
            dispatchEventToListOptionGroup(new MouseEvent('mouseover'));
            await waitForUpdatesAsync();
            expect(getListOptionGroupTitle()).toEqual(groupLabel);
            dispatchEventToListOptionGroup(new MouseEvent('mouseout'));
            await waitForUpdatesAsync();
            const newGroupLabel = 'a different very long value that should get ellipsized due to not fitting within the allocated width';
            slottedLabel.textContent = newGroupLabel;
            dispatchEventToListOptionGroup(new MouseEvent('mouseover'));
            await waitForUpdatesAsync();
            expect(getListOptionGroupTitle()).toEqual(newGroupLabel);
        });

        it('removing slotted label removes title', async () => {
            const groupLabel = 'a very long value that should get ellipsized due to not fitting within the allocated width';
            element.label = undefined;
            const slottedLabel = document.createElement('span');
            slottedLabel.textContent = groupLabel;
            element.appendChild(slottedLabel);
            await waitForUpdatesAsync();
            dispatchEventToListOptionGroup(new MouseEvent('mouseover'));
            await waitForUpdatesAsync();
            expect(getListOptionGroupTitle()).toEqual(groupLabel);
            dispatchEventToListOptionGroup(new MouseEvent('mouseout'));
            element.removeChild(slottedLabel);
            await waitForUpdatesAsync();
            expect(getListOptionGroupTitle()).toBe('');
        });

        it('when label attribute is set, updating slotted label does not update display', async () => {
            const groupLabel = 'a very long value that should get ellipsized due to not fitting within the allocated width';
            element.label = groupLabel;
            const slottedLabel = document.createElement('span');
            slottedLabel.textContent = 'different value';
            element.appendChild(slottedLabel);
            await waitForUpdatesAsync();
            expect(element.labelSlot.getAttribute('class')).toContain('hidden');
            expect(
                element.shadowRoot
                    ?.querySelector('.label-display')!
                    .textContent?.trim()
            ).toEqual(groupLabel);
        });
    });
});
