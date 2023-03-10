import { html } from '@microsoft/fast-element';
import { keyArrowDown, keyArrowRight, keyEnter } from '@microsoft/fast-web-utilities';
import { AnchorMenuItem } from '..';
import type { Menu } from '../../menu';
import type { MenuItem } from '../../menu-item';
import { waitForUpdatesAsync } from '../../testing/async-helpers';
import { fixture, Fixture } from '../../utilities/tests/fixture';
import { getSpecTypeByNamedList } from '../../utilities/tests/parameterized';

fdescribe('Anchor Menu Item', () => {
    describe('standalone', () => {
        async function setup(): Promise<Fixture<AnchorMenuItem>> {
            return fixture<AnchorMenuItem>(
                html`<nimble-anchor-menu-item href="#"></nimble-anchor-menu-item>`
            );
        }

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

    describe('in a menu', () => {
        async function setup(): Promise<Fixture<Menu>> {
            return fixture<Menu>(
                html`
                    <nimble-menu>
                        <nimble-menu-item>
                            <nimble-icon-xmark slot="start"></nimble-icon-xmark>
                            Item 1
                        </nimble-menu-item>
                        <nimble-anchor-menu-item href="a">Item 2</nimble-anchor-menu-item>
                        <nimble-anchor-menu-item href="b">Item 3</nimble-anchor-menu-item>
                        <nimble-menu-item>
                            <nimble-menu>
                                <nimble-menu-item>Item 4.1</nimble-menu-item>
                                <nimble-anchor-menu-item href="c">Item 4.2</nimble-anchor-menu-item>
                                <nimble-anchor-menu-item href="d">Item 4.3</nimble-anchor-menu-item>
                            </nimble-menu>
                            Item 4
                        </nimble-menu-item>
                    </nimble-menu>
                `
            );
        }

        let element: Menu;
        let item2: AnchorMenuItem;
        let item3: AnchorMenuItem;
        let item4_2: AnchorMenuItem;
        let connect: () => Promise<void>;
        let disconnect: () => Promise<void>;

        beforeEach(async () => {
            ({ element, connect, disconnect } = await setup());
            item2 = element.children[1] as AnchorMenuItem;
            item3 = element.children[2] as AnchorMenuItem;
            item4_2 = element.children[3]?.children[0]?.children[1] as AnchorMenuItem;
        });

        afterEach(async () => {
            await disconnect();
        });

        it('should have startColumnCount set by the menu', async () => {
            await connect();
            await waitForUpdatesAsync();
            expect(item2.startColumnCount).toBe(1);
            expect(item3.startColumnCount).toBe(1);
            expect(item4_2.startColumnCount).toBe(0);
        });
    });
});
