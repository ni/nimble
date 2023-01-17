import { DOM, html } from '@microsoft/fast-element';
import { AnchorTab } from '..';
import { Fixture, fixture } from '../../utilities/tests/fixture';
import { getSpecTypeByNamedList } from '../../utilities/tests/parameterized';

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
    describe('should reflect value to the internal control', () => {
        const focused: string[] = [];
        const disabled: string[] = [];
        for (const attribute of attributeNames) {
            const specType = getSpecTypeByNamedList(
                attribute,
                focused,
                disabled
            );
            // eslint-disable-next-line @typescript-eslint/no-loop-func
            specType(`for attribute ${attribute.name}`, async () => {
                await connect();

                element.setAttribute(attribute.name, 'foo');
                await DOM.nextUpdate();

                expect(element.control.getAttribute(attribute.name)).toBe(
                    'foo'
                );
            });
        }
    });
});
