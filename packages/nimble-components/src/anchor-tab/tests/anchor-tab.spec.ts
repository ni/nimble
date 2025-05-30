import { html } from '@ni/fast-element';
import { parameterizeSpec } from '@ni/jasmine-parameterized';
import { AnchorTab, anchorTabTag } from '..';
import { waitForUpdatesAsync } from '../../testing/async-helpers';
import { type Fixture, fixture } from '../../utilities/tests/fixture';

async function setup(): Promise<Fixture<AnchorTab>> {
    return await fixture<AnchorTab>(html`<${anchorTabTag}></${anchorTabTag}>`);
}

describe('AnchorTab', () => {
    let element: AnchorTab;
    let connect: () => Promise<void>;
    let disconnect: () => Promise<void>;

    beforeEach(async () => {
        ({ element, connect, disconnect } = await setup());
    });

    afterEach(async () => {
        await disconnect();
    });

    it('can construct an element instance', () => {
        expect(document.createElement(anchorTabTag)).toBeInstanceOf(AnchorTab);
    });

    const attributeNames = [
        { name: 'download' },
        { name: 'href' },
        { name: 'hreflang' },
        { name: 'ping' },
        { name: 'referrerpolicy' },
        { name: 'rel' },
        { name: 'target' },
        { name: 'type' }
    ] as const;
    describe('should reflect value to the internal anchor element', () => {
        parameterizeSpec(attributeNames, (spec, name) => {
            spec(`for attribute ${name}`, async () => {
                await connect();

                element.setAttribute(name, 'foo');
                await waitForUpdatesAsync();

                expect(
                    element.shadowRoot!.querySelector('a')!.getAttribute(name)
                ).toBe('foo');
            });
        });
    });
});
