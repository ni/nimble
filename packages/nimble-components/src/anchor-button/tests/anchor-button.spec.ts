import { DOM, html } from '@microsoft/fast-element';
import { AnchorButton } from '..';
import { fixture, Fixture } from '../../utilities/tests/fixture';
import { getSpecTypeByNamedList } from '../../utilities/tests/parameterized';

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
        expect(element.control.classList.contains('control')).toBe(true);
    });

    it('should set the `part` attribute to "control" on the internal control', async () => {
        await connect();
        expect(element.control.part.contains('control')).toBe(true);
    });

    it('should clear `href` on the internal control when disabled', async () => {
        await connect();
        element.control.setAttribute('href', 'http://www.ni.com');

        element.disabled = true;
        await DOM.nextUpdate();

        expect(element.control.getAttribute('href')).toBeNull();
    });

    const attributeNames: { name: string }[] = [
        { name: 'download' },
        { name: 'hreflang' },
        { name: 'ping' },
        { name: 'referrerpolicy' },
        { name: 'rel' },
        { name: 'target' },
        { name: 'type' },
        { name: 'aria-atomic' },
        { name: 'aria-busy' },
        { name: 'aria-controls' },
        { name: 'aria-current' },
        { name: 'aria-describedby' },
        { name: 'aria-details' },
        { name: 'aria-disabled' },
        { name: 'aria-errormessage' },
        { name: 'aria-expanded' },
        { name: 'aria-flowto' },
        { name: 'aria-haspopup' },
        { name: 'aria-hidden' },
        { name: 'aria-invalid' },
        { name: 'aria-keyshortcuts' },
        { name: 'aria-label' },
        { name: 'aria-labelledby' },
        { name: 'aria-live' },
        { name: 'aria-owns' },
        { name: 'aria-relevant' },
        { name: 'aria-roledescription' }
    ];
    describe('should reflect value to the internal control', () => {
        const focused: string[] = [];
        const disabled: string[] = [];
        for (const attribute of attributeNames) {
            const specType = getSpecTypeByNamedList(attribute, focused, disabled);
            // eslint-disable-next-line @typescript-eslint/no-loop-func
            specType(`for attribute ${attribute.name}`, async () => {
                await connect();

                element.setAttribute(attribute.name, 'foo');
                await DOM.nextUpdate();

                expect(element.control.getAttribute(attribute.name)).toBe('foo');
            });
        }
    });
});
