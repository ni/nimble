import { html } from '@microsoft/fast-element';
import { AnchorTab } from '..';
import { waitForUpdatesAsync } from '../../testing/async-helpers';
import { Fixture, fixture } from '../../utilities/tests/fixture';
import { parameterizeNamedList } from '../../utilities/tests/parameterized';

async function setup(): Promise<Fixture<AnchorTab>> {
    return fixture<AnchorTab>(html`<nimble-anchor-tab></nimble-anchor-tab>`);
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
        expect(document.createElement('nimble-anchor-tab')).toBeInstanceOf(
            AnchorTab
        );
    });

    const attributeNames: { name: string }[] = [
        { name: 'download' },
        { name: 'href' },
        { name: 'hreflang' },
        { name: 'ping' },
        { name: 'referrerpolicy' },
        { name: 'rel' },
        { name: 'target' },
        { name: 'type' }
    ];
    describe('should reflect value to the internal anchor element', () => {
        parameterizeNamedList(attributeNames, (spec, name, _value) => {
            spec(
                `for attribute ${name}`,
                async () => {
                    await connect();

                    element.setAttribute(name, 'foo');
                    await waitForUpdatesAsync();

                    expect(
                        element
                            .shadowRoot!.querySelector('a')!
                            .getAttribute(name)
                    ).toBe('foo');
                }
            );
        });
    });
});
