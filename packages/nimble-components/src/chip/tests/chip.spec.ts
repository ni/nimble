import { html } from '@ni/fast-element';
import { Chip, chipTag } from '..';
import { fixture, type Fixture } from '../../utilities/tests/fixture';
import { ChipPageObject } from '../testing/chip.pageobject';
import { sendKeyDownEvent } from '../../utilities/testing/component';

async function setup(): Promise<Fixture<Chip>> {
    return await fixture<Chip>(
        html`<${chipTag}></${chipTag}>`
    );
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

    it('click remove button raises remove event', () => {
        const removeEvent = jasmine.createSpy();
        element.addEventListener('remove', removeEvent);
        const pageObject = new ChipPageObject(element);
        pageObject.clickRemoveButton();
        expect(removeEvent).toHaveBeenCalled();
    });

    it('pressing Delete key raises remove event when preventRemove is false', async () => {
        const removeEvent = jasmine.createSpy();
        element.addEventListener('remove', removeEvent);
        await sendKeyDownEvent(element, 'Delete');
        expect(removeEvent).toHaveBeenCalled();
    });

    it('pressing Backspace key raises remove event when preventRemove is false', async () => {
        const removeEvent = jasmine.createSpy();
        element.addEventListener('remove', removeEvent);
        await sendKeyDownEvent(element, 'Backspace');
        expect(removeEvent).toHaveBeenCalled();
    });

    it('pressing Delete key does not raise remove event when preventRemove is true', async () => {
        element.preventRemove = true;
        const removeEvent = jasmine.createSpy();
        element.addEventListener('remove', removeEvent);
        await sendKeyDownEvent(element, 'Delete');
        expect(removeEvent).not.toHaveBeenCalled();
    });

    it('pressing Backspace key does not raise remove event when preventRemove is true', async () => {
        element.preventRemove = true;
        const removeEvent = jasmine.createSpy();
        element.addEventListener('remove', removeEvent);
        await sendKeyDownEvent(element, 'Backspace');
        expect(removeEvent).not.toHaveBeenCalled();
    });
});
