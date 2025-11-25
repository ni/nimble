import { html } from '@ni/fast-element';
import { Chip, chipTag, ChipSelectionMode } from '..';
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

    it('selected property defaults to false', () => {
        expect(element.selected).toBeFalse();
    });

    it('selectionMode defaults to undefined', () => {
        expect(element.selectionMode).toBeUndefined();
    });

    it('clicking chip toggles selected state and emits selected-change event when selectionMode is single', async () => {
        element.selectionMode = ChipSelectionMode.single;
        const changeEvent = jasmine.createSpy();
        element.addEventListener('selected-change', changeEvent);

        element.click();
        await waitForUpdatesAsync();

        expect(element.selected).toBeTrue();
        expect(changeEvent).toHaveBeenCalledTimes(1);

        element.click();
        await waitForUpdatesAsync();

        expect(element.selected).toBeFalse();
        expect(changeEvent).toHaveBeenCalledTimes(2);
    });

    it('clicking chip does not toggle selected state when selectionMode is none', async () => {
        const changeEvent = jasmine.createSpy();
        element.addEventListener('selected-change', changeEvent);

        element.click();
        await waitForUpdatesAsync();

        expect(element.selected).toBeFalse();
        expect(changeEvent).not.toHaveBeenCalled();
    });

    it('pressing Space toggles selected state and emits selected-change event when selectionMode is single', async () => {
        element.selectionMode = ChipSelectionMode.single;
        const changeEvent = jasmine.createSpy();
        element.addEventListener('selected-change', changeEvent);

        element.dispatchEvent(new KeyboardEvent('keyup', { key: ' ' }));
        await waitForUpdatesAsync();

        expect(element.selected).toBeTrue();
        expect(changeEvent).toHaveBeenCalledTimes(1);
    });

    it('pressing Enter toggles selected state and emits selected-change event when selectionMode is single', async () => {
        element.selectionMode = ChipSelectionMode.single;
        const changeEvent = jasmine.createSpy();
        element.addEventListener('selected-change', changeEvent);

        element.dispatchEvent(new KeyboardEvent('keyup', { key: 'Enter' }));
        await waitForUpdatesAsync();

        expect(element.selected).toBeTrue();
        expect(changeEvent).toHaveBeenCalledTimes(1);
    });

    it('clicking when disabled does not toggle selected state', async () => {
        element.selectionMode = ChipSelectionMode.single;
        element.disabled = true;
        const changeEvent = jasmine.createSpy();
        element.addEventListener('selected-change', changeEvent);

        element.click();
        await waitForUpdatesAsync();

        expect(element.selected).toBeFalse();
        expect(changeEvent).not.toHaveBeenCalled();
    });

    it('applies tabindex of 0 when selectionMode is single', async () => {
        element.selectionMode = ChipSelectionMode.single;
        await waitForUpdatesAsync();

        expect(element.getAttribute('tabindex')).toBe('0');
    });

    it('removes internally managed tabindex when disabled', async () => {
        element.selectionMode = ChipSelectionMode.single;
        await waitForUpdatesAsync();

        element.disabled = true;
        await waitForUpdatesAsync();

        expect(element.hasAttribute('tabindex')).toBeFalse();
    });

    it('preserves user supplied tabindex value', async () => {
        element.setAttribute('tabindex', '-1');
        await waitForUpdatesAsync();

        element.selectionMode = ChipSelectionMode.single;
        await waitForUpdatesAsync();

        expect(element.getAttribute('tabindex')).toBe('-1');
    });

    it('does not toggle selection when remove button is clicked', async () => {
        element.selectionMode = ChipSelectionMode.single;
        element.removable = true;
        await waitForUpdatesAsync();
        const changeEvent = jasmine.createSpy();
        element.addEventListener('selected-change', changeEvent);
        const pageObject = new ChipPageObject(element);

        pageObject.clickRemoveButton();
        await waitForUpdatesAsync();

        expect(element.selected).toBeFalse();
        expect(changeEvent).not.toHaveBeenCalled();
    });

    it('remove button is not visible when disabled', async () => {
        element.disabled = true;
        await waitForUpdatesAsync();
        const pageObject = new ChipPageObject(element);
        expect(pageObject.isRemoveButtonVisible()).toBeFalse();
    });

    it('should not set tabindex on the remove button when chip is selectable', async () => {
        element.removable = true;
        element.selectionMode = ChipSelectionMode.single;
        await waitForUpdatesAsync();
        const pageObject = new ChipPageObject(element);
        expect(pageObject.getRemoveButtonTabIndex()).toBe('-1');
    });

    it('should reflect `tabindex` value to the internal button when chip is not selectable', async () => {
        element.removable = true;
        element.selectionMode = ChipSelectionMode.none;
        await waitForUpdatesAsync();
        const pageObject = new ChipPageObject(element);

        element.setAttribute('tabindex', '-1');
        await waitForUpdatesAsync();

        expect(pageObject.getRemoveButtonTabIndex()).toBe('-1');
    });

    it('should clear `tabindex` attribute from the internal button when removed from host and chip is not selectable', async () => {
        element.removable = true;
        element.selectionMode = ChipSelectionMode.none;
        await waitForUpdatesAsync();
        const pageObject = new ChipPageObject(element);

        element.removeAttribute('tabindex');
        await waitForUpdatesAsync();

        expect(pageObject.getRemoveButtonTabIndex()).toBeNull();
    });

    describe('remove button mousedown state', () => {
        beforeEach(async () => {
            element.removable = true;
            element.selectionMode = ChipSelectionMode.single;
            await waitForUpdatesAsync();
        });

        it('sets remove-button-active attribute on mousedown', async () => {
            const pageObject = new ChipPageObject(element);

            pageObject.mousedownRemoveButton();
            await waitForUpdatesAsync();

            expect(element.hasAttribute('remove-button-active')).toBeTrue();
        });

        it('clears remove-button-active attribute on mouseup', async () => {
            const pageObject = new ChipPageObject(element);

            pageObject.mousedownRemoveButton();
            await waitForUpdatesAsync();
            expect(element.hasAttribute('remove-button-active')).toBeTrue();

            document.dispatchEvent(new MouseEvent('mouseup'));
            await waitForUpdatesAsync();

            expect(element.hasAttribute('remove-button-active')).toBeFalse();
        });

        it('cleans up mouseup listener when disconnected during mousedown', async () => {
            const pageObject = new ChipPageObject(element);

            pageObject.mousedownRemoveButton();
            await waitForUpdatesAsync();
            expect(element.hasAttribute('remove-button-active')).toBeTrue();

            // Disconnect while mouse is still down
            await disconnect();

            // Verify no errors when mouseup fires after disconnect
            expect(() => document.dispatchEvent(new MouseEvent('mouseup'))).not.toThrow();
        });

        it('does not show chip active state styling when remove button is mousedown', async () => {
            const pageObject = new ChipPageObject(element);

            pageObject.mousedownRemoveButton();
            await waitForUpdatesAsync();

            // Verify the remove-button-active attribute is set, which prevents active styling
            expect(element.hasAttribute('remove-button-active')).toBeTrue();
        });

        it('handles multiple mousedown events without leaking listeners', async () => {
            const pageObject = new ChipPageObject(element);

            // First mousedown
            pageObject.mousedownRemoveButton();
            await waitForUpdatesAsync();
            document.dispatchEvent(new MouseEvent('mouseup'));
            await waitForUpdatesAsync();

            // Second mousedown
            pageObject.mousedownRemoveButton();
            await waitForUpdatesAsync();
            expect(element.hasAttribute('remove-button-active')).toBeTrue();

            document.dispatchEvent(new MouseEvent('mouseup'));
            await waitForUpdatesAsync();
            expect(element.hasAttribute('remove-button-active')).toBeFalse();
        });
    });

    describe('escape key removes chip', () => {
        it('emits remove event when Escape is pressed on selectable removable chip', async () => {
            element.removable = true;
            element.selectionMode = ChipSelectionMode.single;
            await waitForUpdatesAsync();

            const removeEvent = jasmine.createSpy();
            element.addEventListener('remove', removeEvent);

            const event = new KeyboardEvent('keyup', { key: 'Escape' });
            element.dispatchEvent(event);

            expect(removeEvent).toHaveBeenCalledTimes(1);
        });

        it('does not emit remove event when Escape is pressed on non-selectable chip', async () => {
            element.removable = true;
            element.selectionMode = ChipSelectionMode.none;
            await waitForUpdatesAsync();

            const removeEvent = jasmine.createSpy();
            element.addEventListener('remove', removeEvent);

            const event = new KeyboardEvent('keyup', { key: 'Escape' });
            element.dispatchEvent(event);

            expect(removeEvent).not.toHaveBeenCalled();
        });

        it('does not emit remove event when Escape is pressed on non-removable chip', async () => {
            element.removable = false;
            element.selectionMode = ChipSelectionMode.single;
            await waitForUpdatesAsync();

            const removeEvent = jasmine.createSpy();
            element.addEventListener('remove', removeEvent);

            const event = new KeyboardEvent('keyup', { key: 'Escape' });
            element.dispatchEvent(event);

            expect(removeEvent).not.toHaveBeenCalled();
        });

        it('does not emit remove event when Escape is pressed on disabled chip', async () => {
            element.removable = true;
            element.selectionMode = ChipSelectionMode.single;
            element.disabled = true;
            await waitForUpdatesAsync();

            const removeEvent = jasmine.createSpy();
            element.addEventListener('remove', removeEvent);

            const event = new KeyboardEvent('keyup', { key: 'Escape' });
            element.dispatchEvent(event);

            expect(removeEvent).not.toHaveBeenCalled();
        });
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
