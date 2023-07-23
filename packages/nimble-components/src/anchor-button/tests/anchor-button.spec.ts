import { html } from '@microsoft/fast-element';
import { AnchorButton } from '..';
import { waitForUpdatesAsync } from '../../testing/async-helpers';
import { fixture, Fixture } from '../../utilities/tests/fixture';
import { parameterize } from '../../utilities/tests/parameterized';

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

    const attributeNames = {
        download: 'download',
        hreflang: 'hreflang',
        ping: 'ping',
        referrerpolicy: 'referrerpolicy',
        rel: 'rel',
        target: 'target',
        type: 'type',
        ariaAtomic: 'aria-atomic',
        ariaBusy: 'aria-busy',
        ariaControls: 'aria-controls',
        ariaCurrent: 'aria-current',
        ariaDescribedby: 'aria-describedby',
        ariaDetails: 'aria-details',
        ariaDisabled: 'aria-disabled',
        ariaErrormessage: 'aria-errormessage',
        ariaExpanded: 'aria-expanded',
        ariaFlowto: 'aria-flowto',
        ariaHaspopup: 'aria-haspopup',
        ariaHidden: 'aria-hidden',
        ariaInvalid: 'aria-invalid',
        ariaKeyshortcuts: 'aria-keyshortcuts',
        ariaLabel: 'aria-label',
        ariaLabelledby: 'aria-labelledby',
        ariaLive: 'aria-live',
        ariaOwns: 'aria-owns',
        ariaRelevant: 'aria-relevant',
        ariaRoledescription: 'aria-roledescription',
    };
    describe('should reflect value to the internal control', () => {
        parameterize(attributeNames, (spec, _, value) => {
            spec(`for attribute ${value}`, async () => {
                await connect();

                element.setAttribute(value, 'foo');
                await waitForUpdatesAsync();

                expect(element.control!.getAttribute(value)).toBe(
                    'foo'
                );
            });
        });
    });
});
