import { html } from '@ni/fast-element';
import { Chip, chipTag } from '..';
import { fixture, type Fixture } from '../../utilities/tests/fixture';
import { ChipPageObject } from '../testing/chip.pageobject';
import { waitForUpdatesAsync } from '../../testing/async-helpers';

async function setup(): Promise<Fixture<Chip>> {
    return await fixture<Chip>(html`<${chipTag}></${chipTag}>`);
}

describe('Chip', () => {
    let element: Chip;
    let connect: () => Promise<void>;
    let disconnect: () => Promise<void>;

    beforeEach(async () => {
        ({ element, connect, disconnect } = await setup());
        await connect();
    });

    afterEach(async () => {
        await disconnect();
    });

    it('can construct an element instance', () => {
        expect(document.createElement(chipTag)).toBeInstanceOf(Chip);
    });

    it('click remove button raises remove event', async () => {
        element.removable = true;
        await waitForUpdatesAsync();
        const removeEvent = jasmine.createSpy();
        element.addEventListener('remove', removeEvent);
        const pageObject = new ChipPageObject(element);
        expect(pageObject.isRemoveButtonVisible()).toBeTrue();
        pageObject.clickRemoveButton();
        expect(removeEvent).toHaveBeenCalled();
    });

    it('remove button is not visible when not removable', async () => {
        element.removable = false;
        await waitForUpdatesAsync();
        const pageObject = new ChipPageObject(element);
        expect(pageObject.isRemoveButtonVisible()).toBeFalse();
    });

    it('remove button is not visible when disabled', async () => {
        element.disabled = true;
        await waitForUpdatesAsync();
        const pageObject = new ChipPageObject(element);
        expect(pageObject.isRemoveButtonVisible()).toBeFalse();
    });

    describe('title overflow', () => {
        beforeEach(async () => {
            element.style.width = '200px';
            await waitForUpdatesAsync();
        });

        function dispatchEventToChipContent(event: Event): boolean | undefined {
            return element
                .shadowRoot!.querySelector('.content')!
                .dispatchEvent(event);
        }

        function getChipContentTitle(): string {
            return (
                element
                    .shadowRoot!.querySelector('.content')!
                    .getAttribute('title') ?? ''
            );
        }

        it('sets title when chip text is ellipsized', async () => {
            const chipContent = 'a very long value that should get ellipsized due to not fitting within the allocated width';
            element.textContent = chipContent;
            dispatchEventToChipContent(new MouseEvent('mouseover'));
            await waitForUpdatesAsync();
            expect(getChipContentTitle()).toBe(chipContent);
        });
    });
});
