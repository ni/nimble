import { html } from '@microsoft/fast-element';
import { AnchorButton } from '..';
import { waitForUpdatesAsync } from '../../testing/async-helpers';
import { fixture, Fixture } from '../../utilities/tests/fixture';
import { parameterizeList } from '../../utilities/tests/parameterized';

async function setup(): Promise<Fixture<AnchorButton>> {
    return fixture<AnchorButton>(
        html`<nimble-anchor-button></nimble-anchor-button>`
    );
}

describe('AnchorButton', () => {
    let element: AnchorButton;
    let connect: () => Promise<void>;
    let disconnect: () => Promise<void>;

    beforeEach(async () => {
        ({ element, connect, disconnect } = await setup());
    });

    afterEach(async () => {
        await disconnect();
    });

    it('can construct an element instance', () => {
        expect(document.createElement('nimble-anchor-button')).toBeInstanceOf(
            AnchorButton
        );
    });

    it('should set the "control" class on the internal control', async () => {
        await connect();
        expect(element.control!.classList.contains('control')).toBe(true);
    });

    it('should set the `part` attribute to "control" on the internal control', async () => {
        await connect();
        expect(element.control!.part.contains('control')).toBe(true);
    });

    it('should clear `href` on the internal control when disabled', async () => {
        await connect();
        element.control!.setAttribute('href', 'http://www.ni.com');

        element.disabled = true;
        await waitForUpdatesAsync();

        expect(element.control!.getAttribute('href')).toBeNull();
    });

    const attributeNames = [
        'download',
        'hreflang',
        'ping',
        'referrerpolicy',
        'rel',
        'target',
        'type',
        'aria-atomic',
        'aria-busy',
        'aria-controls',
        'aria-current',
        'aria-describedby',
        'aria-details',
        'aria-disabled',
        'aria-errormessage',
        'aria-expanded',
        'aria-flowto',
        'aria-haspopup',
        'aria-hidden',
        'aria-invalid',
        'aria-keyshortcuts',
        'aria-label',
        'aria-labelledby',
        'aria-live',
        'aria-owns',
        'aria-relevant',
        'aria-roledescription'
    ] as const;
    describe('should reflect value to the internal control', () => {
        parameterizeList(attributeNames, (spec, name) => {
            spec(`for attribute ${name}`, async () => {
                await connect();

                element.setAttribute(name, 'foo');
                await waitForUpdatesAsync();

                expect(element.control!.getAttribute(name)).toBe('foo');
            });
        });
    });
});
