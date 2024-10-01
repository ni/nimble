import { html } from '@microsoft/fast-element';
import { parameterizeSuite } from '@ni/jasmine-parameterized';
import { Menu, menuTag } from '..';
import { menuItemTag } from '../../menu-item';
import { anchorMenuItemTag } from '../../anchor-menu-item';
import { iconCheckTag } from '../../icons/check';
import { Fixture, fixture } from '../../utilities/tests/fixture';
import { waitForUpdatesAsync } from '../../testing/async-helpers';

describe('Menu', () => {
    it('should export its tag', () => {
        expect(menuTag).toBe('nimble-menu');
    });

    it('can construct an element instance', () => {
        expect(document.createElement('nimble-menu')).toBeInstanceOf(Menu);
    });

    const menuItemTypes = [
        {
            name: menuItemTag
        },
        {
            name: anchorMenuItemTag
        }
    ] as const;
    parameterizeSuite(menuItemTypes, (suite, name) => {
        suite(`with ${name}s`, () => {
            async function setup(): Promise<Fixture<Menu>> {
                return await fixture<Menu>(html`
                    <${menuTag}>
                        <${name}>Item 1</${name}>
                        <${name}>Item 2</${name}>
                    </${menuTag}>
                `);
            }
            let element: Menu;
            let item1: Element;
            let item2: Element;
            let connect: () => Promise<void>;
            let disconnect: () => Promise<void>;

            beforeEach(async () => {
                ({ element, connect, disconnect } = await setup());
                await connect();
                await waitForUpdatesAsync();
                const items = element.querySelectorAll('[role="menuitem"]');
                item1 = items[0]!;
                item2 = items[1]!;
            });

            afterEach(async () => {
                await disconnect();
            });

            it('indents items when an item with an icon is slotted after connecting', async () => {
                expect(item1.classList.contains('indent-0')).toBeTrue();
                expect(item2.classList.contains('indent-0')).toBeTrue();

                const item3 = document.createElement(name);
                const icon = document.createElement(iconCheckTag);
                icon.slot = 'start';
                item3.appendChild(icon);
                element.appendChild(item3);
                await waitForUpdatesAsync();

                expect(item1.classList.contains('indent-1')).toBeTrue();
                expect(item2.classList.contains('indent-1')).toBeTrue();
                expect(item3.classList.contains('indent-1')).toBeTrue();
            });

            it('does not indent items when the only item with an icon is removed', async () => {
                const icon = document.createElement(iconCheckTag);
                icon.slot = 'start';
                item1.appendChild(icon);
                await waitForUpdatesAsync();

                element.removeChild(item1);
                await waitForUpdatesAsync();

                expect(item2.classList.contains('indent-0')).toBeTrue();
                expect(item2.classList.contains('indent-1')).toBeFalse();
            });

            it('indents newly added item (without icon) when there was already an item with an icon', async () => {
                const icon = document.createElement(iconCheckTag);
                icon.slot = 'start';
                item1.appendChild(icon);
                await waitForUpdatesAsync();

                const item3 = document.createElement(name);
                element.appendChild(item3);
                await waitForUpdatesAsync();

                expect(item3.classList.contains('indent-1')).toBeTrue();
            });

            it('does not indent newly added item (without icon) when there were no items with icons', async () => {
                const item3 = document.createElement(name);
                element.appendChild(item3);
                await waitForUpdatesAsync();

                expect(item3.classList.contains('indent-0')).toBeTrue();
            });

            it('indents items when an icon is slotted after connecting', async () => {
                expect(item1.classList.contains('indent-0')).toBeTrue();
                expect(item2.classList.contains('indent-0')).toBeTrue();

                const icon = document.createElement(iconCheckTag);
                icon.slot = 'start';
                item1.appendChild(icon);
                await waitForUpdatesAsync();

                expect(item1.classList.contains('indent-1')).toBeTrue();
                expect(item2.classList.contains('indent-1')).toBeTrue();
            });

            it("indents items when an icon's slot is changed to 'start'", async () => {
                expect(item1.classList.contains('indent-0')).toBeTrue();
                expect(item2.classList.contains('indent-0')).toBeTrue();

                const icon = document.createElement(iconCheckTag);
                item1.appendChild(icon);
                await waitForUpdatesAsync();

                expect(item1.classList.contains('indent-0')).toBeTrue();
                expect(item2.classList.contains('indent-0')).toBeTrue();

                icon.slot = 'start';
                await waitForUpdatesAsync();

                expect(item1.classList.contains('indent-1')).toBeTrue();
                expect(item2.classList.contains('indent-1')).toBeTrue();
            });

            it('does not indent items when the only icon is removed', async () => {
                const icon = document.createElement(iconCheckTag);
                icon.slot = 'start';
                item1.appendChild(icon);
                await waitForUpdatesAsync();

                item1.removeChild(icon);
                await waitForUpdatesAsync();

                expect(item1.classList.contains('indent-0')).toBeTrue();
                expect(item2.classList.contains('indent-0')).toBeTrue();
                expect(item1.classList.contains('indent-1')).toBeFalse();
                expect(item2.classList.contains('indent-1')).toBeFalse();
            });
        });
    });
});
