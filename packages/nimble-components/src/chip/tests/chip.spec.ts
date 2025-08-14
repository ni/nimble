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
        pageObject.clickRemoveButton();
        expect(removeEvent).toHaveBeenCalled();
    });
});
