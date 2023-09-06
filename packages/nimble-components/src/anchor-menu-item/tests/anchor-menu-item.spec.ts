/* eslint-disable max-classes-per-file */
import { customElement, html, ref } from '@microsoft/fast-element';
import { MenuItem as FoundationMenuItem } from '@microsoft/fast-foundation';
import { AnchorMenuItem, anchorMenuItemTag } from '..';
import { anchorTag } from '../../anchor';
import { buttonTag } from '../../button';
import type { IconCheck } from '../../icons/check';
import type { IconXmark } from '../../icons/xmark';
import { Menu, menuTag } from '../../menu';
import { menuItemTag } from '../../menu-item';
import { waitForUpdatesAsync } from '../../testing/async-helpers';
import { fixture, Fixture } from '../../utilities/tests/fixture';
import { getSpecTypeByNamedList } from '../../utilities/tests/parameterized';

@customElement('foundation-menu-item')
export class TestMenuItem extends FoundationMenuItem {}

describe('Anchor Menu Item', () => {
    describe('standalone', () => {
        class Model {
            public xmarkIcon!: IconXmark;
            public checkIcon!: IconCheck;
        }

        async function setup(source: Model): Promise<Fixture<AnchorMenuItem>> {
            return fixture<AnchorMenuItem>(
                html`<nimble-anchor-menu-item href="#">
                    <nimble-xmark-icon
                        ${ref('xmarkIcon')}
                        slot="start"
                    ></nimble-xmark-icon>
                    <nimble-check-icon
                        ${ref('checkIcon')}
                        slot="end"
                    ></nimble-check-icon>
                </nimble-anchor-menu-item>`,
                { source }
            );
        }

        let model: Model;
        let element: AnchorMenuItem;
        let connect: () => Promise<void>;
        let disconnect: () => Promise<void>;

        beforeEach(async () => {
            model = new Model();
            ({ element, connect, disconnect } = await setup(model));
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

        it('should expose slotted content through properties', async () => {
            await connect();
            expect(element.start.assignedElements()[0]).toBe(model.xmarkIcon);
            expect(element.end.assignedElements()[0]).toBe(model.checkIcon);
        });

        it('should set start slot visible and end slot not visible', async () => {
            await connect();
            expect(
                getComputedStyle(element.start).display === 'none'
                    || getComputedStyle(element.startContainer).display === 'none'
            ).toBeFalse();
            expect(
                getComputedStyle(element.end).display === 'none'
                    || getComputedStyle(element.endContainer).display === 'none'
            ).toBeTrue();
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

    describe('FoundationMenuItem instanceof override', () => {
        it('returns true for FoundationMenuItem', () => {
            const foundationMenuItem = document.createElement(
                'foundation-menu-item'
            );
            expect(foundationMenuItem instanceof FoundationMenuItem).toBeTrue();
        });

        it('returns true for AnchorMenuItem', () => {
            const anchorMenuItem = document.createElement(anchorMenuItemTag);
            expect(anchorMenuItem instanceof FoundationMenuItem).toBeTrue();
        });

        it('returns true for MenuItem', () => {
            const menuItem = document.createElement(menuItemTag);
            expect(menuItem instanceof FoundationMenuItem).toBeTrue();
        });

        it('returns false for Menu', () => {
            const menu = document.createElement(menuTag);
            expect(menu instanceof FoundationMenuItem).toBeFalse();
        });

        it('returns false for Anchor', () => {
            const anchor = document.createElement(anchorTag);
            expect(anchor instanceof FoundationMenuItem).toBeFalse();
        });

        it('returns false for Button', () => {
            const button = document.createElement(buttonTag);
            expect(button instanceof FoundationMenuItem).toBeFalse();
        });

        it('returns false for div', () => {
            const div = document.createElement('div');
            expect(div instanceof FoundationMenuItem).toBeFalse();
        });
    });
});
