import { html } from '@microsoft/fast-element';
import { AnchorMenuItem } from '..';
import { waitForUpdatesAsync } from '../../testing/async-helpers';
import { fixture, Fixture } from '../../utilities/tests/fixture';
import { getSpecTypeByNamedList } from '../../utilities/tests/parameterized';

async function setup(): Promise<Fixture<AnchorMenuItem>> {
    return fixture<AnchorMenuItem>(
        html`<nimble-anchor-menu-item href="#"></nimble-anchor-menu-item>`
    );
}

describe('Anchor Menu Item', () => {
    let element: AnchorMenuItem;
    let connect: () => Promise<void>;
    let disconnect: () => Promise<void>;

    beforeEach(async () => {
        ({ element, connect, disconnect } = await setup());
    });

    afterEach(async () => {
        await disconnect();
    });

    it('can construct an element instance', () => {
        expect(
            document.createElement('nimble-anchor-menu-item')
        ).toBeInstanceOf(AnchorMenuItem);
    });

    it('should set the role to menuitem', async () => {
        await connect();
        expect(element.getAttribute('role')).toBe('menuitem');
    });

    it('should set aria-disabled when disabled is set', async () => {
        await connect();
        element.disabled = true;
        await waitForUpdatesAsync();
        expect(element.ariaDisabled).toBe('true');
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
                await waitForUpdatesAsync();

                expect(element.anchor.getAttribute(attribute.name)).toBe('foo');
            });
        }
    });
});
