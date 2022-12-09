import { DOM, html } from '@microsoft/fast-element';
import {
    DesignSystem,
    Anchor as FoundationAnchor
} from '@microsoft/fast-foundation';
import { Anchor } from '..';
import { fixture, Fixture } from '../../utilities/tests/fixture';

async function setup(): Promise<Fixture<Anchor>> {
    return fixture<Anchor>(html`<nimble-anchor></nimble-anchor>`);
}

describe('Anchor', () => {
    let element: Anchor;
    let connect: () => Promise<void>;
    let disconnect: () => Promise<void>;

    beforeEach(async () => {
        ({ element, connect, disconnect } = await setup());
    });

    afterEach(async () => {
        await disconnect();
    });

    it('should have its tag returned by tagFor(FoundationAnchor)', () => {
        expect(DesignSystem.tagFor(FoundationAnchor)).toBe('nimble-anchor');
    });

    it('can construct an element instance', () => {
        expect(document.createElement('nimble-anchor')).toBeInstanceOf(Anchor);
    });

    it('should set the "control" class on the internal control', async () => {
        await connect();
        expect(element.control.classList.contains('control')).toBe(true);
    });

    it('should set the `part` attribute to "control" on the internal control', async () => {
        await connect();
        expect(element.control.part.contains('control')).toBe(true);
    });

    const reflectAttributeTestData: { attrName: string }[] = [
        { attrName: 'download' },
        { attrName: 'hreflang' },
        { attrName: 'ping' },
        { attrName: 'referrerpolicy' },
        { attrName: 'rel' },
        { attrName: 'target' },
        { attrName: 'type' },
        { attrName: 'aria-atomic' },
        { attrName: 'aria-busy' },
        { attrName: 'aria-controls' },
        { attrName: 'aria-current' },
        { attrName: 'aria-describedby' },
        { attrName: 'aria-details' },
        { attrName: 'aria-disabled' },
        { attrName: 'aria-errormessage' },
        { attrName: 'aria-expanded' },
        { attrName: 'aria-flowto' },
        { attrName: 'aria-haspopup' },
        { attrName: 'aria-hidden' },
        { attrName: 'aria-invalid' },
        { attrName: 'aria-keyshortcuts' },
        { attrName: 'aria-label' },
        { attrName: 'aria-labelledby' },
        { attrName: 'aria-live' },
        { attrName: 'aria-owns' },
        { attrName: 'aria-relevant' },
        { attrName: 'aria-roledescription' }
    ];
    reflectAttributeTestData.forEach(testData => {
        it(`should reflect \`${testData.attrName}\` value to the internal control`, async () => {
            await connect();

            element.setAttribute(testData.attrName, 'foo');
            await DOM.nextUpdate();

            expect(element.control.getAttribute(testData.attrName)).toBe('foo');
        });
    });
});
