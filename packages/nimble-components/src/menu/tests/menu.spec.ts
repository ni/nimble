import { html } from '@microsoft/fast-element';
import { Menu, menuTag } from '..';
import { menuItemTag } from '../../menu-item';
import { anchorMenuItemTag } from '../../anchor-menu-item';
import { iconCheckTag } from '../../icons/check';
import { Fixture, fixture } from '../../utilities/tests/fixture';
import { waitForUpdatesAsync } from '../../testing/async-helpers';

describe('Menu', () => {
    async function setup(): Promise<Fixture<Menu>> {
        return fixture<Menu>(html`
            <${menuTag}>
                <${menuItemTag}>Item 1</${menuItemTag}>
                <${anchorMenuItemTag}>Item 2</${anchorMenuItemTag}>
            </${menuTag}>
        `);
    }

    it('should export its tag', () => {
        expect(menuTag).toBe('nimble-menu');
    });

    it('can construct an element instance', () => {
        expect(document.createElement('nimble-menu')).toBeInstanceOf(Menu);
    });

    it('properly indents items when an icon is slotted or removed after connecting', async () => {
        const { element, connect, disconnect } = await setup();
        await connect();
        await waitForUpdatesAsync();

        const items = element.querySelectorAll('[role="menuitem"]');
        const item1 = items[0]!;
        const item2 = items[1]!;
        expect(item1.classList.contains('indent-0')).toBeTrue();
        expect(item2.classList.contains('indent-0')).toBeTrue();

        const icon = document.createElement(iconCheckTag);
        icon.slot = 'start';
        // Ensure works with regular menu item
        item1.appendChild(icon);
        await waitForUpdatesAsync();

        expect(item1.classList.contains('indent-1')).toBeTrue();
        expect(item2.classList.contains('indent-1')).toBeTrue();

        item1.removeChild(icon);
        await waitForUpdatesAsync();

        expect(item1.classList.contains('indent-0')).toBeTrue();
        expect(item1.classList.contains('indent-1')).toBeFalse();
        expect(item2.classList.contains('indent-0')).toBeTrue();
        expect(item2.classList.contains('indent-1')).toBeFalse();

        // Ensure works with anchor menu item
        item2.appendChild(icon);
        await waitForUpdatesAsync();

        expect(item1.classList.contains('indent-1')).toBeTrue();
        expect(item2.classList.contains('indent-1')).toBeTrue();

        await disconnect();
    });
});
