import { html, ref } from '@microsoft/fast-element';
import { AnchorMenuItem } from '..';
import type { Menu } from '../../menu';
import { waitForUpdatesAsync } from '../../testing/async-helpers';
import { fixture, Fixture } from '../../utilities/tests/fixture';
import { getSpecTypeByNamedList } from '../../utilities/tests/parameterized';

describe('Anchor Menu Item', () => {
    describe('standalone', () => {
        async function setup(): Promise<Fixture<AnchorMenuItem>> {
            return fixture<AnchorMenuItem>(
                html`<nimble-anchor-menu-item
                    href="#"
                ></nimble-anchor-menu-item>`
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

                    expect(element.anchor.getAttribute(attribute.name)).toBe(
                        'foo'
                    );
                });
            }
        });
    });

    describe('in a menu', () => {
        class Model {
            public item2!: AnchorMenuItem;
            public item3!: AnchorMenuItem;
            public item4dot2!: AnchorMenuItem;
        }

        async function setup(source: Model): Promise<Fixture<Menu>> {
            return fixture<Menu>(
                html`
                    <nimble-menu>
                        <nimble-menu-item>
                            <nimble-icon-xmark slot="start"></nimble-icon-xmark>
                            Item 1
                        </nimble-menu-item>
                        <nimble-anchor-menu-item ${ref('item2')} href="a"
                            >Item 2</nimble-anchor-menu-item
                        >
                        <nimble-anchor-menu-item ${ref('item3')} href="b"
                            >Item 3</nimble-anchor-menu-item
                        >
                        <nimble-menu-item>
                            <nimble-menu>
                                <nimble-menu-item>Item 4.1</nimble-menu-item>
                                <nimble-anchor-menu-item
                                    ${ref('item4dot2')}
                                    href="c"
                                    >Item 4.2</nimble-anchor-menu-item
                                >
                                <nimble-anchor-menu-item href="d"
                                    >Item 4.3</nimble-anchor-menu-item
                                >
                            </nimble-menu>
                            Item 4
                        </nimble-menu-item>
                    </nimble-menu>
                `,
                { source }
            );
        }

        let connect: () => Promise<void>;
        let disconnect: () => Promise<void>;
        let model: Model;

        beforeEach(async () => {
            model = new Model();
            ({ connect, disconnect } = await setup(model));
        });

        afterEach(async () => {
            await disconnect();
        });

        it('should have startColumnCount set by the menu', async () => {
            await connect();
            await waitForUpdatesAsync();
            expect(model.item2.startColumnCount).toBe(1);
            expect(model.item3.startColumnCount).toBe(1);
            expect(model.item4dot2.startColumnCount).toBe(0);
        });
    });
});
