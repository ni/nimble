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

    it('remove button has title and content', async () => {
        element.removable = true;
        await waitForUpdatesAsync();
        const pageObject = new ChipPageObject(element);
        expect(pageObject.getRemoveButtonTextContent()).toBe('Remove');
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

    it('should set a tabindex of 0 on the internal button', async () => {
        element.removable = true;
        await waitForUpdatesAsync();
        const pageObject = new ChipPageObject(element);
        expect(pageObject.getRemoveButton()!.getAttribute('tabindex')).toBe(
            '0'
        );
    });

    it('should reflect `tabindex` value to the internal button', async () => {
        element.removable = true;
        await waitForUpdatesAsync();
        const pageObject = new ChipPageObject(element);

        element.setAttribute('tabindex', '-1');
        await waitForUpdatesAsync();

        expect(pageObject.getRemoveButton()!.getAttribute('tabindex')).toBe(
            '-1'
        );
    });

    it('should set the `tabindex` attribute to 0 on the internal button when removed from host', async () => {
        element.removable = true;
        await waitForUpdatesAsync();
        const pageObject = new ChipPageObject(element);

        element.removeAttribute('tabindex');
        await waitForUpdatesAsync();

        expect(pageObject.getRemoveButton()!.getAttribute('tabindex')).toBe(
            '0'
        );
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
